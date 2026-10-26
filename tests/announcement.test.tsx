import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Announcement } from "@/components/landing/announcement";

const wide = () => document.querySelector(".sm\\:inline")!;
const narrow = () => document.querySelector(".sm\\:hidden")!;

describe("Announcement", () => {
  it("lists the names with commas and a final 'and', names in the foreground colour", () => {
    render(<Announcement titles={["Skeleton", "Progress", "Breadcrumb", "Accordion"]} />);

    expect(wide()).toHaveTextContent("Skeleton, Progress, Breadcrumb and Accordion are here");
    const names = [...wide().querySelectorAll(".text-foreground")].map((n) => n.textContent);
    expect(names).toEqual(["Skeleton", "Progress", "Breadcrumb", "Accordion"]);
    expect(narrow()).toHaveTextContent("4 new components");
  });

  it("reads naturally for two names and for one", () => {
    const { rerender } = render(<Announcement titles={["Skeleton", "Progress"]} />);
    expect(wide()).toHaveTextContent("Skeleton and Progress are here");

    rerender(<Announcement titles={["Skeleton"]} />);
    expect(wide()).toHaveTextContent("Skeleton is here");
    expect(narrow()).toHaveTextContent("1 new component");
    expect(narrow()).not.toHaveTextContent("components");
  });

  it("leads with a New badge and links to the new section", () => {
    render(<Announcement titles={["Skeleton"]} />);

    expect(screen.getByText("New")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByRole("link", { name: "See what's new →" })).toHaveAttribute("href", "#new");
  });

  it("tints the bar and draws the fading primary line", () => {
    const { container } = render(<Announcement titles={["Skeleton"]} />);

    expect(container.firstElementChild).toHaveClass(
      "via-(--announce-tint)",
      "from-(--surface-elevated)",
      "after:via-primary",
      "after:from-transparent",
      "after:h-px",
    );
  });
});
