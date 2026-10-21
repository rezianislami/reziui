import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Root } from "fumadocs-core/page-tree";
import { Sidebar } from "@/components/docs/sidebar";

function renderTree(children: Root["children"]) {
  return render(<Sidebar tree={{ name: "docs", children }} />);
}

describe("Sidebar", () => {
  it("renders page items as links to their url", () => {
    renderTree([{ type: "page", name: "Introduction", url: "/docs" }]);

    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "href",
      "/docs",
    );
  });

  it("renders separators as non-link labels", () => {
    renderTree([{ type: "separator", name: "Components" }]);

    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("links a folder name to its index page when one exists", () => {
    renderTree([
      {
        type: "folder",
        name: "Components",
        index: { type: "page", name: "Overview", url: "/docs/components" },
        children: [{ type: "page", name: "Button", url: "/docs/components/button" }],
      },
    ]);

    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/docs/components",
    );
    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute(
      "href",
      "/docs/components/button",
    );
  });

  it("renders a folder without an index as plain text with nested children", () => {
    renderTree([
      {
        type: "folder",
        name: "Components",
        children: [{ type: "page", name: "Button", url: "/docs/components/button" }],
      },
    ]);

    expect(screen.queryByRole("link", { name: "Components" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Button" })).toBeInTheDocument();
  });

  it("renders an empty nav for an empty tree", () => {
    renderTree([]);

    expect(screen.getByRole("navigation", { name: "Documentation" })).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
