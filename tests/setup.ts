import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-registers cleanup when test globals are enabled;
// globals stay off here, so unmount between tests explicitly.
afterEach(() => {
  cleanup();
});

// jsdom implements no layout, so Element#scrollIntoView is missing; components
// that keep a selection in view call it unconditionally, as every browser has it.
Element.prototype.scrollIntoView ??= () => {};

// Radix measures popper content (popover, menu, tooltip) with ResizeObserver,
// which jsdom lacks.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// Radix Select captures the pointer on its trigger; jsdom has no pointer
// capture API.
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.setPointerCapture ??= () => {};

// jsdom has no matchMedia. No media query matches by default (so motion is
// allowed); tests that need reduced motion stub window.matchMedia themselves.
// The legacy listener methods are there because next-themes subscribes to
// the colour-scheme query with them.
window.matchMedia ??= ((query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }) as unknown as MediaQueryList) as typeof window.matchMedia;
