import * as React from "react";

import { cn } from "@/lib/utils";

type KbdProps = React.ComponentProps<"kbd"> & {
  /**
   * Renders the key pressed down: it drops 1px and its bottom edge thins from
   * 2px to 1px, like a physical key. Drive it from real key events to echo the
   * user's shortcut back at them.
   */
  pressed?: boolean;
};

// The 2px bottom border is what makes a Kbd read as a physical key; without it
// the shape would be indistinguishable from an outline Badge. Pressing trades
// 1px of that edge for 1px of downward travel, so the key's footprint stays put.
function Kbd({ className, pressed = false, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      data-pressed={pressed || undefined}
      className={cn(
        "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-[0.25rem] border border-b-2 border-border bg-card px-1.5 font-mono text-[11px] leading-none font-medium text-foreground select-none",
        "motion-safe:transition-[translate,border-bottom-width] motion-safe:duration-75 motion-safe:ease-out",
        "data-pressed:translate-y-px data-pressed:border-b",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}

/** Groups keys of one shortcut, e.g. Ctrl + Shift + P. */
function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
export type { KbdProps };
