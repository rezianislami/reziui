"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";
import { CommandTokens, tone } from "./command-tokens";
import { CopyButton } from "./copy-button";

// Each package manager's "run a package without installing it". Only this
// part differs between the tabs; the rest of the command is shared.
const RUNNERS = {
  npm: "npx",
  pnpm: "pnpm dlx",
  bun: "bunx --bun",
  yarn: "yarn dlx",
} as const;

type Runner = keyof typeof RUNNERS;

// Landing only: shown once when the block scrolls into view, then it settles on
// "button". Three swaps 1.1s apart finish in under 5s, so the moving text
// needs no pause control (WCAG 2.2.2 covers motion that lasts longer than that).
export const ROTATION = ["button", "dialog", "select", "button"] as const;
export const ROTATION_START_MS = 700;
export const ROTATION_STEP_MS = 1100;

/**
 * Odometer for one part of the command: the old value slides up and out, the
 * new one up from below (200ms), and the slot's width eases to the new value
 * so the text after it glides instead of jumping. Both values share one grid
 * cell; the slot clips them vertically. Under reduced motion nothing animates,
 * so the leaving value is hidden outright (animationend would never fire to
 * remove it).
 */
function RollingText({
  value,
  render = (text) => text,
  slot,
}: {
  value: string;
  render?: (text: string) => ReactNode;
  slot: string;
}) {
  const [shown, setShown] = useState(value);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [width, setWidth] = useState<number>();
  const current = useRef<HTMLSpanElement>(null);

  // Adjust state during render when the value changes (React's recommended
  // pattern for deriving from props), rather than in an effect.
  if (value !== shown) {
    setLeaving(shown);
    setShown(value);
  }

  useLayoutEffect(() => {
    if (current.current?.offsetWidth) setWidth(current.current.offsetWidth);
  }, [shown]);

  const motion = "motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";
  return (
    <span
      data-slot={slot}
      className={cn("relative inline-grid overflow-hidden align-bottom motion-safe:transition-[width]", motion)}
      style={width ? { width } : undefined}
    >
      {/* w-max + justify-self-start: measured above, so it must be as wide as
          its text, not stretched to the slot's current width (which would
          lock the slot at the widest value seen). */}
      <span
        key={shown}
        ref={current}
        className={cn(
          "col-start-1 row-start-1 w-max justify-self-start whitespace-pre",
          "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-full",
          motion,
        )}
      >
        {render(shown)}
      </span>
      {leaving !== null && (
        <span
          key={`leaving-${leaving}-${shown}`}
          aria-hidden="true"
          onAnimationEnd={() => setLeaving(null)}
          className={cn(
            "col-start-1 row-start-1 w-max justify-self-start whitespace-pre",
            "motion-safe:animate-out motion-safe:fade-out-0 motion-safe:slide-out-to-top-full motion-safe:fill-mode-forwards motion-reduce:hidden",
            motion,
          )}
        >
          {render(leaving)}
        </span>
      )}
    </span>
  );
}

export function InstallCommand({
  name,
}: {
  /** Registry item to install (docs pages). Without it the name rotates once through ROTATION (landing). */
  name?: string;
}) {
  const [runner, setRunner] = useState<Runner>("npm");
  const [rotating, setItem] = useState<string>(ROTATION[0]);
  const item = name ?? rotating;
  const block = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const command = `${RUNNERS[runner]} shadcn@latest add @reziui/${item}`;

  function stopRotation() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  // Rotate once, the first time the block is on screen. Skipped entirely
  // under reduced motion; cancelled by any interaction with the block (see
  // stopRotation), so the command never changes under someone's cursor.
  useEffect(() => {
    const el = block.current;
    if (name !== undefined || !el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timers.current = ROTATION.slice(1).map((name, i) =>
          setTimeout(() => setItem(name), ROTATION_START_MS + i * ROTATION_STEP_MS),
        );
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stopRotation();
    };
  }, [name]);

  return (
    <div
      ref={block}
      onPointerEnter={stopRotation}
      onFocus={stopRotation}
      className="w-full overflow-hidden rounded-[0.75rem] bg-card shadow-xs ring ring-border"
    >
      <div className="flex h-12 items-center gap-2 border-b border-(--hairline) ps-2.5 pe-2">
        <Tabs value={runner} onValueChange={(value) => setRunner(value as Runner)}>
          <TabsList aria-label="Package manager">
            {(Object.keys(RUNNERS) as Runner[]).map((name) => (
              <TabsTrigger key={name} value={name}>
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <CopyButton value={command} size="icon-sm" aria-label="Copy command" className="ms-auto" />
      </div>
      {/* Scrolls sideways instead of wrapping on narrow screens: a command
          split across lines is easy to copy wrong by hand. */}
      <pre className="flex gap-2.5 overflow-x-auto px-4.5 py-4 font-mono text-xs sm:text-sm">
        <span aria-hidden="true" className="text-muted-foreground select-none">
          $
        </span>
        <code className="text-foreground">
          <RollingText slot="runner" value={RUNNERS[runner]} render={(text) => <CommandTokens command={text} />} />
          <span> shadcn@latest</span>
          <span className={tone.keyword}> add</span>
          <span className={tone.namespace}> @reziui/</span>
          <RollingText slot="item" value={item} render={(text) => <span className={tone.item}>{text}</span>} />
        </code>
      </pre>
    </div>
  );
}
