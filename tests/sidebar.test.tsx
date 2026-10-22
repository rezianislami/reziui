import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Root } from "fumadocs-core/page-tree";
import { Sidebar } from "@/components/docs/sidebar";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

function renderTree(children: Root["children"]) {
  return render(<Sidebar tree={{ name: "docs", children }} />);
}

describe("Sidebar", () => {
  beforeEach(() => {
    navigation.pathname = "/";
  });

  it("marks only the link for the current path as the active page", () => {
    navigation.pathname = "/docs/components/button";
    renderTree([
      { type: "page", name: "Introduction", url: "/docs" },
      { type: "page", name: "Button", url: "/docs/components/button" },
    ]);

    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Introduction" })).not.toHaveAttribute("aria-current");
  });

  it("does not treat a path prefix as active", () => {
    // /docs is a prefix of every docs URL; only an exact match is the current page.
    navigation.pathname = "/docs/installation";
    renderTree([{ type: "page", name: "Introduction", url: "/docs" }]);

    expect(screen.getByRole("link", { name: "Introduction" })).not.toHaveAttribute("aria-current");
  });

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

  it("labels pages in their New window, read as part of the link name", () => {
    render(
      <Sidebar
        tree={{
          name: "docs",
          children: [
            { type: "page", name: "Button", url: "/docs/components/button" },
            { type: "page", name: "Switch", url: "/docs/components/switch" },
          ],
        }}
        newUrls={["/docs/components/switch"]}
      />,
    );

    expect(screen.getByRole("link", { name: "Switch, new" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Button" })).not.toHaveTextContent("New");
    expect(screen.getByText("New")).toHaveAttribute("aria-hidden", "true");
  });
});
