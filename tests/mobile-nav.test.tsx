import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Root } from "fumadocs-core/page-tree";
import { MobileNav } from "@/components/docs/mobile-nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/components/button" }));

const tree: Root = {
  name: "docs",
  children: [
    { type: "separator", name: "Components" },
    { type: "page", name: "Button", url: "/docs/components/button" },
  ],
};
const links = [{ href: "/docs", label: "Docs" }];

describe("MobileNav", () => {
  it("opens a drawer with the main links and the docs tree", async () => {
    render(<MobileNav tree={tree} links={links} />);

    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const drawer = screen.getByRole("dialog", { name: "ziUI" });
    expect(within(drawer).getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(within(drawer).getByRole("link", { name: "Button" })).toHaveAttribute("aria-current", "page");
  });

  it("closes from the close button", async () => {
    render(<MobileNav tree={tree} links={links} />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));

    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when a link is clicked, even for the current page", async () => {
    render(<MobileNav tree={tree} links={links} />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));

    await userEvent.click(screen.getByRole("link", { name: "Button" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open when clicking non-link content inside the drawer", async () => {
    render(<MobileNav tree={tree} links={links} />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));

    await userEvent.click(screen.getByText("Components"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
