import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Label } from "@/registry/reziui/ui/label";
import { Switch } from "@/registry/reziui/ui/switch";

describe("Switch", () => {
  it("toggles on click and reports its state as a switch", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Airplane mode" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "Airplane mode" });

    expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.click(control);

    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles with the keyboard and from its label", async () => {
    render(
      <>
        <Switch id="wifi" />
        <Label htmlFor="wifi">Wi-Fi</Label>
      </>,
    );
    const control = screen.getByRole("switch", { name: "Wi-Fi" });

    control.focus();
    await userEvent.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByText("Wi-Fi"));
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("ignores interaction while disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Locked" disabled onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole("switch"));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("renders its own thumb, so consumers pass no children", () => {
    render(<Switch aria-label="Thumb" defaultChecked />);

    const thumb = screen.getByRole("switch").querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toHaveAttribute("data-state", "checked");
    expect(thumb).toHaveClass("start-0.5", "data-[state=checked]:start-4.5");
  });

  it("positions the thumb with a logical inset, so it follows the computed direction", () => {
    render(<Switch aria-label="Direction" />);

    // A physical translate needs an rtl: variant, and Tailwind's rtl: matches
    // any [dir=rtl] ancestor — inside a dir="ltr" island in an RTL page it
    // pushes the thumb off the track.
    const thumb = screen.getByRole("switch").querySelector('[data-slot="switch-thumb"]')!;
    expect(thumb.className).not.toMatch(/translate-x|rtl:/);
    expect(thumb).toHaveClass("absolute", "motion-safe:transition-[inset-inline-start,width]");
  });

  it("stretches the thumb while pressed, pinned to the side it travels to", () => {
    render(<Switch aria-label="Press" />);

    const thumb = screen.getByRole("switch").querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toHaveClass(
      "group-enabled/switch:group-active/switch:w-5",
      "group-enabled/switch:group-active/switch:data-[state=checked]:start-3.5",
    );
  });

  it("reads the control tokens that clear 3:1, not --input or a consumer's --primary", () => {
    render(<Switch aria-label="Tokens" />);

    const control = screen.getByRole("switch");
    expect(control).toHaveClass("bg-(--control-off)", "data-[state=checked]:bg-(--btn-primary)");
    expect(control.className).not.toMatch(/bg-input|bg-primary\b/);
  });

  it("animates only when motion is allowed and keeps a forced-colors-safe focus outline", () => {
    render(<Switch aria-label="Motion" />);

    const control = screen.getByRole("switch");
    const thumb = control.querySelector('[data-slot="switch-thumb"]')!;
    expect(thumb.className).not.toMatch(/(^|\s)transition-/);
    expect(thumb).toHaveClass("motion-safe:transition-[inset-inline-start,width]");
    expect(control).toHaveClass("focus-visible:outline-2", "focus-visible:outline-solid");
  });

  it("extends its 20px track to a 24px hit area", () => {
    render(<Switch aria-label="Target" />);

    expect(screen.getByRole("switch")).toHaveClass("h-5", "after:absolute", "after:-inset-y-0.5");
  });
});
