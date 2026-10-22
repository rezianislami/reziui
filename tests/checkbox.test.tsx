import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "@/registry/reziui/ui/checkbox";
import { Label } from "@/registry/reziui/ui/label";

const mark = (box: HTMLElement, name: "check" | "indeterminate") =>
  box.querySelector<SVGPathElement>(`[data-mark="${name}"]`)!;

describe("Checkbox", () => {
  it("toggles on click and from its label", async () => {
    const onCheckedChange = vi.fn();
    render(
      <>
        <Checkbox id="terms" onCheckedChange={onCheckedChange} />
        <Label htmlFor="terms">Accept terms</Label>
      </>,
    );
    const box = screen.getByRole("checkbox", { name: "Accept terms" });

    await userEvent.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByText("Accept terms"));
    expect(box).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
  });

  it("toggles with Space", async () => {
    render(<Checkbox aria-label="Space" />);
    const box = screen.getByRole("checkbox");

    box.focus();
    await userEvent.keyboard(" ");

    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("exposes the indeterminate state as mixed and shows the dash", () => {
    render(<Checkbox aria-label="All" checked="indeterminate" />);
    const box = screen.getByRole("checkbox");

    expect(box).toHaveAttribute("aria-checked", "mixed");
    expect(mark(box, "indeterminate")).toHaveClass("group-data-[state=indeterminate]/checkbox:[stroke-dashoffset:0]");
    expect(box).toHaveClass("data-[state=indeterminate]:bg-(--btn-primary)");
  });

  it("keeps both marks mounted while unchecked so they can animate out", () => {
    render(<Checkbox aria-label="Unchecked" />);
    const box = screen.getByRole("checkbox");

    for (const name of ["check", "indeterminate"] as const) {
      expect(mark(box, name)).toHaveAttribute("pathLength", "1");
      expect(mark(box, name)).toHaveClass("[stroke-dashoffset:1]", "opacity-0");
    }
    expect(box.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("draws the check in slower than it erases it, only when motion is allowed", () => {
    render(<Checkbox aria-label="Motion" />);
    const check = mark(screen.getByRole("checkbox"), "check");

    expect(check).toHaveClass("motion-safe:duration-100", "motion-safe:group-data-[state=checked]/checkbox:duration-200");
    expect(check.getAttribute("class")).not.toMatch(/(^|\s)transition-/);
  });

  it("ignores clicks while disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Disabled" disabled onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("uses the destructive edge when aria-invalid is set", () => {
    render(<Checkbox aria-label="Invalid" aria-invalid />);

    expect(screen.getByRole("checkbox")).toHaveClass("aria-invalid:border-destructive");
  });

  it("uses the 3:1 control edge, an outline focus ring and a 24px hit area", () => {
    render(<Checkbox aria-label="Edge" />);
    const box = screen.getByRole("checkbox");

    expect(box).toHaveClass("border-(--control-off)", "focus-visible:outline-solid", "after:-inset-1", "size-4");
    expect(box.className).not.toMatch(/border-input/);
  });
});
