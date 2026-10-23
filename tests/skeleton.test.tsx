import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "@/registry/reziui/ui/skeleton";

const block = () => document.querySelector('[data-slot="skeleton"]')!;

describe("Skeleton", () => {
  it("is decorative, so the loading region carries the meaning", () => {
    render(
      <div aria-busy="true" aria-label="Loading post">
        <Skeleton className="h-3 w-40" />
      </div>,
    );

    expect(block()).toHaveAttribute("aria-hidden", "true");
  });

  it("uses its own surface token and an 8px radius that className can override", () => {
    const { rerender } = render(<Skeleton className="h-3" />);
    expect(block()).toHaveClass("bg-(--skeleton)", "rounded-md", "overflow-hidden", "h-3");

    rerender(<Skeleton className="size-10 rounded-full" />);
    expect(block()).toHaveClass("rounded-full");
    expect(block()).not.toHaveClass("rounded-md");
  });

  it("shimmers only with motion allowed, and reverses in right-to-left layouts", () => {
    render(<Skeleton />);

    expect(block()).toHaveClass(
      "motion-safe:after:animate-skeleton-shimmer",
      "rtl:after:[animation-direction:reverse]",
      "after:via-white/60",
      "dark:after:via-white/6",
    );
    expect(block().className).not.toMatch(/(^| )after:animate-/);
  });

  it("passes other props through", () => {
    render(<Skeleton data-testid="x" style={{ width: 120 }} />);

    expect(block()).toHaveAttribute("data-testid", "x");
    expect(block()).toHaveStyle({ width: "120px" });
  });
});
