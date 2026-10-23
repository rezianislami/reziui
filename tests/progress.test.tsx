import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "@/registry/reziui/ui/progress";

const indicator = () => document.querySelector<HTMLElement>('[data-slot="progress-indicator"]')!;

describe("Progress", () => {
  it("is a named progressbar reporting its value", () => {
    render(<Progress value={64} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });

    expect(bar).toHaveAttribute("aria-valuenow", "64");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("data-state", "loading");
  });

  it("offsets the full-width fill by the remaining share, scaled by max", () => {
    const { rerender } = render(<Progress value={64} aria-label="Upload" />);
    expect(indicator().style.translate).toBe("calc(-36% * var(--progress-dir)) 0");

    rerender(<Progress value={30} max={60} aria-label="Upload" />);
    expect(indicator().style.translate).toBe("calc(-50% * var(--progress-dir)) 0");
    expect(indicator()).toHaveClass("w-full", "motion-safe:duration-300");
  });

  it("clamps out-of-range values", () => {
    render(<Progress value={100} aria-label="Done" />);
    expect(indicator().style.translate).toBe("calc(0% * var(--progress-dir)) 0");
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-state", "complete");
  });

  it("is indeterminate without a value: no aria-valuenow, a sliding 30% segment", () => {
    render(<Progress aria-label="Syncing" />);
    const bar = screen.getByRole("progressbar", { name: "Syncing" });

    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-state", "indeterminate");
    expect(indicator()).toHaveClass(
      "absolute",
      "left-0",
      "w-[30%]",
      "motion-safe:animate-progress-indeterminate",
      "motion-reduce:animate-pulse",
      "motion-reduce:translate-x-[116.67%]",
    );
    expect(indicator().style.translate).toBe("");
  });

  it("treats null as indeterminate too", () => {
    render(<Progress value={null} aria-label="Syncing" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-state", "indeterminate");
  });

  it("flips direction in right-to-left layouts through one variable", () => {
    render(<Progress value={10} aria-label="Upload" />);
    expect(screen.getByRole("progressbar")).toHaveClass("[--progress-dir:1]", "rtl:[--progress-dir:-1]", "bg-(--control-track)", "h-1");
  });
});
