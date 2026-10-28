import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isPageScrollLocked, SmoothScroll } from "@/components/smooth-scroll";

const lenis = vi.hoisted(() => ({ props: undefined as Record<string, unknown> | undefined }));

vi.mock("lenis/react", () => ({
  ReactLenis: (props: Record<string, unknown>) => {
    lenis.props = props;
    return null;
  },
}));

function renderOptions() {
  render(<SmoothScroll />);
  return lenis.props?.options as Record<string, unknown>;
}

describe("SmoothScroll", () => {
  it("drives the page scroll rather than a wrapper element", () => {
    render(<SmoothScroll />);

    expect(lenis.props?.root).toBe(true);
  });

  it("leaves elements with their own scrollbar to native scrolling", () => {
    expect(renderOptions().allowNestedScroll).toBe(true);
  });

  it("animates hash links so TOC and in-page anchors stay smooth", () => {
    expect(renderOptions().anchors).toBe(true);
  });

  it("keeps Lenis' reduced-motion default instead of opting out", () => {
    expect(renderOptions()).not.toHaveProperty("respectReducedMotion");
  });

  describe("while a modal locks page scroll", () => {
    afterEach(() => document.body.removeAttribute("data-scroll-locked"));

    it("lets the page scroll smoothly when nothing is locked", () => {
      const prevent = renderOptions().prevent as (node: HTMLElement) => boolean;

      expect(prevent(document.body)).toBe(false);
    });

    it("hands events back to the browser so the lock holds", () => {
      const prevent = renderOptions().prevent as (node: HTMLElement) => boolean;
      // react-remove-scroll's marker; the value is a lock counter.
      document.body.setAttribute("data-scroll-locked", "1");

      expect(prevent(document.body)).toBe(true);
      expect(isPageScrollLocked()).toBe(true);
    });

    it("resumes smooth scrolling once the modal closes", () => {
      document.body.setAttribute("data-scroll-locked", "1");
      document.body.removeAttribute("data-scroll-locked");

      expect(isPageScrollLocked()).toBe(false);
    });
  });
});
