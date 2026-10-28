import { flushSync } from "react-dom";

type Theme = "light" | "dark";

// Width of the soft edge; must match the gradient in the
// ::view-transition-new(root) rule in app/globals.css.
const FEATHER = 48;

/**
 * Switches the theme with the new one growing as a soft-edged circle from
 * `origin` (the toggle) until it covers the viewport, via a same-document
 * View Transition. Browsers without View Transitions and visitors who prefer
 * reduced motion get the plain instant switch.
 *
 * Why a View Transition rather than animating CSS variables: every token
 * changes at once and the circle reveals the finished new page, so nothing
 * passes through half-light, half-dark colours; it also costs no extra DOM.
 *
 * The animation itself lives in the stylesheet (a registered `--sweep-r`
 * driving a radial mask); this only hands it the origin and end radius. Why
 * a mask and not clip-path: clip-path can only cut a hard edge. Why a CSS
 * animation and not element.animate(): animating a registered custom
 * property from CSS keyframes works in every browser that has View
 * Transitions, while doing it through the Web Animations API on a
 * pseudo-element is less consistent.
 */
export function sweepTheme(next: Theme, setTheme: (theme: Theme) => void, origin: { x: number; y: number }) {
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => { finished: Promise<void> };
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) {
    setTheme(next);
    return;
  }

  const root = document.documentElement;
  const { x, y } = origin;
  // Far enough that even the inner end of the soft edge clears the
  // farthest corner, so the last frame is the plain new page.
  const end =
    Math.round(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))) + FEATHER;
  root.style.setProperty("--sweep-x", `${x}px`);
  root.style.setProperty("--sweep-y", `${y}px`);
  root.style.setProperty("--sweep-end", `${end}px`);

  const transition = doc.startViewTransition(() => {
    flushSync(() => setTheme(next));
    // next-themes only writes the class in an effect after the render, which
    // can land after the browser takes the new snapshot. Writing it here as
    // well (the same class and color-scheme it sets) makes the snapshot
    // right; next-themes' own write is then a no-op.
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
  });

  transition.finished.finally(() => {
    for (const p of ["--sweep-x", "--sweep-y", "--sweep-end"]) root.style.removeProperty(p);
  });
}
