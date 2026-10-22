import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "@/registry/reziui/ui/textarea";

describe("Textarea", () => {
  it("renders a native textarea that takes typed text", async () => {
    render(<Textarea aria-label="Message" />);

    await userEvent.type(screen.getByRole("textbox", { name: "Message" }), "Hello{Enter}world");

    expect(screen.getByRole("textbox")).toHaveValue("Hello\nworld");
  });

  it("grows with its content from an 80px minimum, and stays resizable where it can't grow", () => {
    render(<Textarea aria-label="Message" />);

    expect(screen.getByRole("textbox")).toHaveClass("field-sizing-content", "min-h-20", "resize-y");
  });

  it("matches Input: radius 8, ring, outline focus, 16px text on phones", () => {
    render(<Textarea aria-label="Message" />);

    expect(screen.getByRole("textbox")).toHaveClass(
      "rounded-md",
      "ring-input",
      "focus-visible:outline-solid",
      "text-base",
      "sm:text-sm",
      "px-3",
      "py-2",
    );
  });

  it("uses the destructive ring when invalid and dims when disabled", () => {
    render(<Textarea aria-label="Message" aria-invalid disabled />);

    expect(screen.getByRole("textbox")).toHaveClass("aria-invalid:ring-destructive", "disabled:opacity-50");
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
