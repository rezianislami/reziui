import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "@/registry/reziui/ui/input";

function ClearableSearch({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Input
      aria-label="Search"
      startIcon={<svg data-testid="icon" />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue("")}
      clearLabel="Clear search"
    />
  );
}

const clearButton = () => document.querySelector<HTMLButtonElement>('button[aria-label^="Clear"]')!;

describe("Input", () => {
  it("renders a bare input without a wrapper by default", () => {
    render(<Input aria-label="Name" />);

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveClass("h-9", "rounded-md");
    expect(input.parentElement).not.toHaveAttribute("data-slot", "input-group");
  });

  it("is never pill-shaped", () => {
    render(<Input aria-label="Name" />);

    expect(screen.getByRole("textbox")).not.toHaveClass("rounded-full");
  });

  it("uses 16px text on small screens so iOS does not zoom on focus", () => {
    render(<Input aria-label="Name" />);

    expect(screen.getByRole("textbox")).toHaveClass("text-base", "sm:text-sm");
  });

  it("focuses with an outline that survives forced-colors mode", () => {
    render(<Input aria-label="Name" />);

    expect(screen.getByRole("textbox")).toHaveClass(
      "outline-hidden",
      "focus-visible:outline-2",
      "focus-visible:outline-solid",
      "focus-visible:outline-ring",
    );
    expect(screen.getByRole("textbox")).not.toHaveClass("outline-none");
  });

  it("wraps the field and pads the start side when a start icon is given", () => {
    render(<Input aria-label="Search" startIcon={<svg data-testid="icon" />} />);

    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input.parentElement).toHaveAttribute("data-slot", "input-group");
    expect(input).toHaveClass("ps-9");
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("icon").parentElement).toHaveClass("start-3");
  });

  it("shows the clear button only while the controlled value is non-empty", async () => {
    render(<ClearableSearch initial="button" />);

    expect(clearButton()).toHaveAttribute("data-state", "visible");
    expect(clearButton()).not.toHaveAttribute("inert");

    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue("");
    expect(clearButton()).toHaveAttribute("data-state", "hidden");
    expect(clearButton()).toHaveAttribute("inert");

    await userEvent.type(screen.getByRole("textbox", { name: "Search" }), "a");
    expect(clearButton()).toHaveAttribute("data-state", "visible");
  });

  it("keeps the hidden clear button out of focus and the accessibility tree", () => {
    render(<ClearableSearch />);

    expect(clearButton()).toHaveAttribute("inert");
    expect(clearButton()).not.toHaveAttribute("aria-hidden");
    expect(clearButton()).toHaveClass("data-[state=hidden]:pointer-events-none");
  });

  it("does not offer clearing for uncontrolled or disabled fields", () => {
    const onClear = vi.fn();
    render(
      <>
        <Input aria-label="Uncontrolled" defaultValue="x" onClear={onClear} />
        <Input aria-label="Disabled" value="x" readOnly disabled onClear={onClear} />
      </>,
    );

    for (const button of document.querySelectorAll('button[aria-label="Clear"]')) {
      expect(button).toHaveAttribute("data-state", "hidden");
    }
  });

  it("hides the browser's own search × when it renders its own clear button", () => {
    render(<Input type="search" aria-label="Search" value="" onChange={() => {}} onClear={() => {}} />);

    expect(screen.getByRole("searchbox")).toHaveClass(
      "[&::-webkit-search-cancel-button]:hidden",
      "[&::-webkit-search-cancel-button]:appearance-none",
    );
  });

  it("leaves the browser's search × alone without onClear", () => {
    render(<Input type="search" aria-label="Search" startIcon={<svg />} />);

    expect(screen.getByRole("searchbox")).not.toHaveClass("[&::-webkit-search-cancel-button]:hidden");
  });

  it("animates the clear button only when motion is allowed", () => {
    render(<ClearableSearch initial="x" />);

    expect(clearButton().className).toMatch(/motion-safe:transition-\[opacity,scale,filter\]/);
    expect(clearButton()).toHaveClass("data-[state=hidden]:scale-25", "data-[state=hidden]:blur-[4px]");
  });

  it("uses the destructive ring when aria-invalid is set", () => {
    render(<Input aria-label="Name" aria-invalid />);

    expect(screen.getByRole("textbox")).toHaveClass("aria-invalid:ring-destructive");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
