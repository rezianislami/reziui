import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Label } from "@/registry/reziui/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/reziui/ui/radio-group";

function Plans({ onValueChange = () => {}, disabledTeam = false }) {
  return (
    <>
      <button type="button">Before</button>
      <RadioGroup defaultValue="pro" aria-label="Plan" onValueChange={onValueChange}>
        {["free", "pro", "team"].map((v) => (
          <div key={v}>
            <RadioGroupItem id={v} value={v} disabled={v === "team" && disabledTeam} />
            <Label htmlFor={v}>{v}</Label>
          </div>
        ))}
      </RadioGroup>
      <button type="button">After</button>
    </>
  );
}

const dot = (radio: HTMLElement) => radio.querySelector('[data-slot="radio-group-indicator"]')!;

describe("RadioGroup", () => {
  it("is a labelled radiogroup with one checked radio", () => {
    render(<Plans />);

    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "free" })).not.toBeChecked();
  });

  it("selects from a click on the radio or its label", async () => {
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);

    await userEvent.click(screen.getByText("free"));
    expect(screen.getByRole("radio", { name: "free" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("free");
  });

  it("is one Tab stop; arrow keys move the selection and skip disabled radios", async () => {
    render(<Plans disabledTeam />);

    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "pro" })).toHaveFocus();

    // Down from "pro" skips the disabled "team" and wraps to "free". (Radix
    // also checks the focused radio by clicking it from a focus handler, which
    // jsdom doesn't run; Space is the explicit equivalent.)
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "free" })).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("radio", { name: "free" })).toBeChecked();

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("keeps the dot mounted so it can scale in, only when motion is allowed", () => {
    render(<Plans />);

    const unchecked = screen.getByRole("radio", { name: "free" });
    expect(dot(unchecked)).toHaveClass("scale-25", "opacity-0", "group-data-[state=checked]/radio:scale-100");
    expect(dot(unchecked).className).not.toMatch(/(^|\s)transition-/);
    expect(dot(unchecked)).toHaveClass("motion-safe:transition-[scale,opacity]");
  });

  it("uses the 3:1 control edge, primary fill, outline focus and a 24px hit area", () => {
    render(<Plans />);

    const radio = screen.getByRole("radio", { name: "pro" });
    expect(radio).toHaveClass(
      "size-4",
      "rounded-full",
      "border-(--control-off)",
      "data-[state=checked]:bg-(--btn-primary)",
      "focus-visible:outline-solid",
      "after:-inset-1",
      "aria-invalid:border-destructive",
    );
  });
});
