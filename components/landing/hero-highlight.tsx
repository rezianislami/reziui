import type { ReactNode } from "react";

// A marker-style highlight: a tint of the brand blue that fades left to right
// (18% to 4%; 32% to 8% in dark, where 18% all but vanishes on the near-black
// page). It is a pseudo-element so it can sweep in from the left while the
// words stay put; reduced motion shows it in place. No glow line under it: the
// announcement bar already uses one on this screen.
//
// The words keep the headline colour rather than turning blue: on the tint they
// stay at full contrast, and blue text would read as a link.
export function HeroHighlight({ children }: { children: ReactNode }) {
  return (
    <span
      className={[
        "relative isolate rounded-md px-2.5 pb-[3px] sm:rounded-[0.625rem] sm:px-3 sm:pb-1",
        "before:absolute before:inset-0 before:-z-10 before:origin-left before:rounded-[inherit] before:bg-linear-to-r before:from-primary/18 before:to-primary/4 dark:before:from-primary/32 dark:before:to-primary/8",
        "motion-safe:before:animate-highlight-sweep",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
