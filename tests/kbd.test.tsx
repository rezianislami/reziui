import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd, KbdGroup } from "@/registry/reziui/ui/kbd";

describe("Kbd", () => {
  it("renders a semantic kbd element", () => {
    render(<Kbd>Esc</Kbd>);

    const key = screen.getByText("Esc");
    expect(key.tagName).toBe("KBD");
    expect(key).toHaveAttribute("data-slot", "kbd");
  });

  it("has the 2px bottom edge that sets it apart from an outline badge", () => {
    render(<Kbd>K</Kbd>);

    expect(screen.getByText("K")).toHaveClass("border", "border-b-2", "font-mono");
  });

  it("groups keys of one shortcut", () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>+<Kbd>P</Kbd>
      </KbdGroup>,
    );

    const group = screen.getByText("Ctrl").parentElement!;
    expect(group).toHaveAttribute("data-slot", "kbd-group");
    expect(group.querySelectorAll("kbd")).toHaveLength(2);
  });

  it("merges a custom className", () => {
    render(<Kbd className="min-w-8">Tab</Kbd>);

    expect(screen.getByText("Tab")).toHaveClass("min-w-8", "h-5");
  });
});
