import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileToc } from "@/components/docs/mobile-toc";

const items = [
  { title: "Installation", url: "#installation", depth: 2 },
  { title: "Variants", url: "#variants", depth: 3 },
];

describe("MobileToc", () => {
  it("starts collapsed and expands to list the headings", async () => {
    render(<MobileToc items={items} />);
    const toggle = screen.getByRole("button", { name: "On this page" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Installation" })).not.toBeInTheDocument();

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute("href", "#installation");
    expect(screen.getByRole("link", { name: "Variants" })).toHaveClass("pl-3");
  });

  it("collapses after a heading is chosen", async () => {
    render(<MobileToc items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "On this page" }));

    await userEvent.click(screen.getByRole("link", { name: "Installation" }));

    expect(screen.getByRole("button", { name: "On this page" })).toHaveAttribute("aria-expanded", "false");
  });

  it("renders nothing when the page has no headings", () => {
    const { container } = render(<MobileToc items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
