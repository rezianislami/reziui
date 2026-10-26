import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Principles, principles } from "@/components/landing/principles";

describe("Principles", () => {
  it("renders the four principles as a list of cards with headings", () => {
    render(<Principles />);
    const list = screen.getByRole("list");

    expect(within(list).getAllByRole("listitem")).toHaveLength(4);
    expect(within(list).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Keyboard & focus",
      "Reduced motion",
      "Dark mode",
      "Right-to-left",
    ]);
    for (const item of within(list).getAllByRole("listitem")) {
      expect(item).toHaveClass("rounded-[1rem]", "bg-card", "ring-inset", "p-5");
    }
  });

  it("keeps every description to one short sentence", () => {
    for (const { description } of principles) {
      expect(description.endsWith(".")).toBe(true);
      expect(description.split(". ")).toHaveLength(1);
      expect(description.length).toBeLessThanOrEqual(68);
    }
  });

  it("hides the icons and keeps them out of the brand blue", () => {
    const { container } = render(<Principles />);
    const icons = container.querySelectorAll("svg");

    expect(icons).toHaveLength(4);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon).toHaveClass("text-foreground");
    }
  });

  it("lays out two columns on phones and four on wide screens, 12px apart like the component grid", () => {
    render(<Principles />);

    expect(screen.getByRole("list")).toHaveClass("grid-cols-2", "lg:grid-cols-4", "gap-3");
  });
});
