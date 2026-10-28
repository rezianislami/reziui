// First-paint entrance, CSS only so it plays in the static HTML before any JS:
// a block comes up out of a soft blur (8px), fading in and rising 8px over
// 600ms on the Rezi UI curve. Stack DELAY steps for a sequence, 60ms apart.
// Everything is motion-safe:, so under reduced motion it is simply there.
//
// Backwards fill rather than both: it holds the start frame through the delay
// (nothing flashes before its turn) and then lets go. A "both" fill keeps the
// animation applied forever, and an element with a transform or filter
// animation in effect becomes the containing block for its fixed descendants
// and the backdrop root for blurs inside it. The end frame equals the
// element's own style, so it looks the same either way.
export const ENTER =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-backwards motion-safe:duration-600 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";

export const DELAY = [
  "",
  "motion-safe:delay-60",
  "motion-safe:delay-120",
  "motion-safe:delay-180",
  "motion-safe:delay-240",
  "motion-safe:delay-300",
];

// The top bar comes down out of the same blur, slower, so it reads as the
// frame settling around the content rather than one more block in the
// sequence. Applied to the bar itself only while nothing sits behind it (top
// of the page on load); backwards fill drops the filter afterwards, so the
// header's own backdrop blur works again once it has landed.
export const ENTER_TOP =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:slide-in-from-top-2 motion-safe:fill-mode-backwards motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";
