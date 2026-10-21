import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Root } from "fumadocs-core/page-tree";
import { Pager } from "@/components/docs/pager";

const tree: Root = {
  name: "docs",
  children: [
    { type: "separator", name: "Getting started" },
    { type: "page", name: "Introduction", url: "/docs" },
    { type: "page", name: "Installation", url: "/docs/installation" },
    { type: "separator", name: "Components" },
    { type: "page", name: "Button", url: "/docs/components/button" },
  ],
};

describe("Pager", () => {
  it("links to the previous and next page across separators", () => {
    render(<Pager tree={tree} url="/docs/installation" />);

    expect(screen.getByRole("link", { name: /Previous.*Introduction/ })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: /Next.*Button/ })).toHaveAttribute("href", "/docs/components/button");
  });

  it("omits the previous link on the first page", () => {
    render(<Pager tree={tree} url="/docs" />);

    expect(screen.queryByRole("link", { name: /Previous/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next.*Installation/ })).toBeInTheDocument();
  });

  it("omits the next link on the last page", () => {
    render(<Pager tree={tree} url="/docs/components/button" />);

    expect(screen.getByRole("link", { name: /Previous.*Installation/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Next/ })).not.toBeInTheDocument();
  });

  it("renders nothing for a url that is not in the tree", () => {
    const { container } = render(<Pager tree={tree} url="/docs/missing" />);

    expect(container).toBeEmptyDOMElement();
  });
});
