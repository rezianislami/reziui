import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/reziui/ui/breadcrumb";

function Trail() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("is a labelled navigation landmark with an ordered list", () => {
    render(<Trail />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });

    expect(nav.querySelector("ol")).toBeInTheDocument();
    // Separators are presentational, so only the three real items are list items.
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the current page as text, not a link", () => {
    render(<Trail />);

    expect(screen.getByText("Settings")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Settings" })).not.toBeInTheDocument();
  });

  it("hides separators and names the ellipsis", () => {
    render(<Trail />);

    for (const sep of document.querySelectorAll('[data-slot="breadcrumb-separator"]')) {
      expect(sep).toHaveAttribute("aria-hidden", "true");
      expect(sep.querySelector("svg")).toBeInTheDocument();
    }
    expect(screen.getByText("More")).toHaveClass("sr-only");
  });

  it("styles links with hover, a 24px hit area and the offset focus ring", async () => {
    render(<Trail />);
    const home = screen.getByRole("link", { name: "Home" });

    expect(home).toHaveClass("hover:text-foreground", "after:-inset-y-0.5", "focus-visible:outline-offset-2");
    await userEvent.tab();
    expect(home).toHaveFocus();
  });

  it("renders a router link through asChild and keeps the label override", () => {
    render(
      <Breadcrumb aria-label="You are here">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="https://example.com/docs" data-router="">
                Docs
              </a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation", { name: "You are here" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAttribute("data-slot", "breadcrumb-link");
  });

  it("accepts a custom separator and mirrors the chevron in right-to-left layouts", () => {
    render(
      <ol>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbSeparator />
      </ol>,
    );
    const [custom, chevron] = document.querySelectorAll('[data-slot="breadcrumb-separator"]');

    expect(custom).toHaveTextContent("/");
    expect(chevron).toHaveClass("rtl:[&>svg]:-scale-x-100");
  });
});
