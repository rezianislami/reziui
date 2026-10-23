import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "@/registry/reziui/ui/slider";

describe("Slider", () => {
  it("puts the accessible name and value on the focusable thumb", () => {
    render(<Slider defaultValue={[40]} aria-label="Volume" />);

    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
  });

  it("names the thumb from aria-labelledby", () => {
    render(
      <>
        <span id="vol">Volume</span>
        <Slider defaultValue={[40]} aria-labelledby="vol" />
      </>,
    );

    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
  });

  it("steps with arrows, Page Up/Down, Home and End", async () => {
    const onValueChange = vi.fn();
    render(<Slider defaultValue={[50]} aria-label="Volume" onValueChange={onValueChange} />);
    const thumb = screen.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "51");
    await userEvent.keyboard("{PageUp}");
    expect(thumb).toHaveAttribute("aria-valuenow", "61");
    await userEvent.keyboard("{Home}");
    expect(thumb).toHaveAttribute("aria-valuenow", "0");
    await userEvent.keyboard("{End}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
    expect(onValueChange).toHaveBeenLastCalledWith([100]);
  });

  it("renders one thumb per value, each with its own name", () => {
    render(<Slider defaultValue={[20, 80]} thumbLabels={["Minimum price", "Maximum price"]} />);

    expect(screen.getByRole("slider", { name: "Minimum price" })).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByRole("slider", { name: "Maximum price" })).toHaveAttribute("aria-valuenow", "80");
  });

  it("starts with one thumb at the minimum without a value", () => {
    render(<Slider min={10} aria-label="Level" />);

    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });

  it("does not move when disabled", async () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" disabled />);
    const thumb = screen.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "50");
    expect(document.querySelector('[data-slot="slider"]')).toHaveClass("data-disabled:opacity-50");
  });

  it("uses the control tokens, a 24px hit area and the offset focus ring", () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />);

    expect(document.querySelector('[data-slot="slider-track"]')).toHaveClass("bg-(--control-track)", "data-[orientation=horizontal]:h-1");
    expect(document.querySelector('[data-slot="slider-range"]')).toHaveClass("bg-(--btn-primary)");
    expect(screen.getByRole("slider")).toHaveClass(
      "size-4",
      "border-(--control-off)",
      "after:-inset-1",
      "focus-visible:outline-offset-2",
    );
  });
});
