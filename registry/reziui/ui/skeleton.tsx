import * as React from "react";

import { cn } from "@/lib/utils";

// A content-shaped placeholder on its own --skeleton surface, 8px radius by
// default (pass rounded-full for an avatar, a height for a line of text).
//
// A soft highlight crosses every block every 1.6s, so the page reads as
// loading rather than empty. It is a pseudo-element moving with `translate`,
// which the compositor animates without repainting the block. The highlight is
// white at 60% in light mode and 6% in dark, a lift rather than a flash. It
// runs end to start in right-to-left layouts, and under reduced motion the
// blocks sit still.
//
// The block is decorative (aria-hidden): mark the loading region itself with
// aria-busy="true" so assistive technology knows content is on its way.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-(--skeleton)",
        "after:pointer-events-none after:absolute after:inset-0 after:-translate-x-full",
        "after:bg-linear-to-r after:from-transparent after:via-white/60 after:to-transparent dark:after:via-white/6",
        "motion-safe:after:animate-skeleton-shimmer rtl:after:[animation-direction:reverse]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
