"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// The same 4px groove as Slider (--control-track) with the filled part in
// --btn-primary, which stays the brand blue even if a consumer's theme
// redefines --primary. Not interactive, so no thumb.
//
// With a value, the indicator is a full-width bar translated left by the
// remaining percentage; a change eases over 300ms. Without one (value null or
// omitted) it is indeterminate: a 30% segment slides from end to end and back
// (1.4s). Under reduced motion that segment stays in the middle and its
// opacity pulses instead, so the "still working" cue remains without movement.
//
// Right-to-left: the determinate fill must grow from the right, so its offset
// is multiplied by --progress-dir, which the root sets to -1. The
// indeterminate segment is pinned to the left edge (absolute, physical) and
// not flipped: its back-and-forth is symmetric, so direction doesn't matter,
// and pinning keeps it inside the track however the browser places a narrow
// block in a right-to-left context.
function Progress({ className, value, max = 100, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const indeterminate = value === null || value === undefined;
  const percent = indeterminate ? 0 : Math.min(Math.max(value / max, 0), 1) * 100;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-(--control-track) [--progress-dir:1] rtl:[--progress-dir:-1]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full rounded-full bg-(--btn-primary)",
          indeterminate
            ? "absolute inset-y-0 left-0 w-[30%] motion-safe:animate-progress-indeterminate motion-reduce:animate-pulse motion-reduce:translate-x-[116.67%]"
            : "w-full motion-safe:transition-[translate] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
        )}
        style={indeterminate ? undefined : { translate: `calc(${percent - 100}% * var(--progress-dir)) 0` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
