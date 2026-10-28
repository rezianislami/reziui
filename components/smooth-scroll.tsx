"use client";

import { ReactLenis } from "lenis/react";

/**
 * Smooth page scrolling for the whole site.
 *
 * - `allowNestedScroll` lets anything with its own scrollbar (docs sidebar and
 *   TOC, the search results list, dialogs, sheets, select and dropdown menus)
 *   scroll natively instead of moving the page. Lenis has to walk the DOM on
 *   each wheel event for this; tagging every container with
 *   `data-lenis-prevent` would be cheaper, but registry components would then
 *   carry a Lenis-only attribute into consumers' projects.
 * - `anchors` animates `#hash` links (TOC, "See what's new"). Lenis reads each
 *   target's `scroll-margin-top`, so the existing `scroll-mt-*` offsets that
 *   clear the sticky header keep working.
 * - Reduced motion needs no option: Lenis honours `prefers-reduced-motion` by
 *   default and scrolls 1:1 when it is set.
 * - `prevent` hands every wheel/touch event back to the browser while a modal
 *   has locked page scroll. Radix modals (dialog, sheet, select) lock it with
 *   react-remove-scroll, which blocks native scrolling and marks
 *   `body[data-scroll-locked]`; Lenis scrolls programmatically, so without
 *   this the page behind an open dialog still moves. Reading the attribute per
 *   event is stateless, unlike stopping/starting Lenis from a MutationObserver.
 */
export function isPageScrollLocked(): boolean {
  return document.body.hasAttribute("data-scroll-locked");
}

export function SmoothScroll() {
  return <ReactLenis root options={{ allowNestedScroll: true, anchors: true, prevent: isPageScrollLocked }} />;
}
