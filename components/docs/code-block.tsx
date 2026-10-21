"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

type CodeBlockProps = {
  /** Shown in the header bar, e.g. a filename or "terminal". */
  title?: ReactNode;
  /** A highlighted <pre> (from shiki) or any code markup. */
  children: ReactNode;
  className?: string;
};

// The copy button reads textContent from the rendered code instead of taking a
// string prop: MDX hands `pre` already-highlighted children, so the raw source
// is no longer available as a string at this point.
export function CodeBlock({ title, children, className }: CodeBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <figure
      data-slot="code-block"
      className={cn("not-prose overflow-hidden rounded-[0.75rem] bg-card ring ring-border", className)}
    >
      <figcaption className="flex h-10 items-center gap-2 border-b border-(--hairline) pr-2 pl-3.5">
        <span className="truncate font-mono text-xs text-muted-foreground">{title ?? "code"}</span>
        <CopyButton
          className="ml-auto text-muted-foreground"
          value={() => ref.current?.textContent ?? ""}
          aria-label="Copy code"
        />
      </figcaption>
      <div
        ref={ref}
        className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed [&_pre]:bg-transparent!"
      >
        {children}
      </div>
    </figure>
  );
}
