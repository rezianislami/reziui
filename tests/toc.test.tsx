import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Toc } from "@/components/docs/toc";

beforeAll(() => {
  // jsdom has no IntersectionObserver; fumadocs' AnchorProvider needs one.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

const items = [
  { title: "Installation", url: "#installation", depth: 2 },
  { title: "Variants", url: "#variants", depth: 3 },
];

describe("Toc", () => {
  it("renders a link per heading pointing at its anchor", () => {
    render(<Toc items={items} />);

    expect(screen.getByRole("navigation", { name: "On this page" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute("href", "#installation");
    expect(screen.getByRole("link", { name: "Variants" })).toHaveAttribute("href", "#variants");
  });

  it("indents h3 entries under their h2", () => {
    render(<Toc items={items} />);

    expect(screen.getByRole("link", { name: "Variants" })).toHaveClass("pl-6");
    expect(screen.getByRole("link", { name: "Installation" })).not.toHaveClass("pl-6");
  });

  it("renders nothing for a page without headings or edit link", () => {
    const { container } = render(<Toc items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows only the edit link when there are no headings", () => {
    render(<Toc items={[]} editUrl="https://example.com/edit" />);

    expect(screen.getByRole("link", { name: "Edit this page" })).toHaveAttribute("href", "https://example.com/edit");
    expect(screen.queryByText("On this page")).not.toBeInTheDocument();
  });
});
