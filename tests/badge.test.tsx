import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "@/registry/ziui/ui/badge";

describe("Badge", () => {
  it("renders a non-interactive span with default variant and size", () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText("New");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-variant", "default");
    expect(badge).toHaveAttribute("data-size", "default");
    expect(badge).toHaveClass("rounded-sm", "h-5");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is never pill-shaped, so it cannot be mistaken for a Button", () => {
    for (const variant of ["default", "secondary", "outline", "success", "warning", "info", "destructive"] as const) {
      expect(badgeVariants({ variant }).split(" ")).not.toContain("rounded-full");
    }
  });

  it.each([
    ["default", "bg-foreground"],
    ["secondary", "bg-accent"],
    ["outline", "ring-border"],
    ["success", "bg-(--success-tint)"],
    ["warning", "text-(--warning-text)"],
    ["info", "ring-(--info-ring)"],
    ["destructive", "text-(--destructive-text)"],
  ] as const)("applies the %s variant classes", (variant, expected) => {
    render(<Badge variant={variant}>Label</Badge>);

    expect(screen.getByText("Label")).toHaveClass(expected);
  });

  it("renders the sm size", () => {
    render(<Badge size="sm">v1.4.0</Badge>);

    expect(screen.getByText("v1.4.0")).toHaveClass("h-4.5", "text-[11px]");
  });

  it("adds a decorative leading dot when requested", () => {
    render(<Badge dot>Ready</Badge>);

    const badge = screen.getByText("Ready");
    const dot = badge.querySelector('[data-slot="badge-dot"]');
    expect(dot).not.toBeNull();
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(badge.firstElementChild).toBe(dot);
  });

  it("renders no dot by default", () => {
    render(<Badge>Plain</Badge>);

    expect(screen.getByText("Plain").querySelector('[data-slot="badge-dot"]')).toBeNull();
  });

  it("renders the child element with asChild and keeps the dot inside it", () => {
    render(
      <Badge asChild variant="info" dot>
        <a href="https://example.com/changelog">Changelog</a>
      </Badge>,
    );

    const link = screen.getByRole("link", { name: "Changelog" });
    expect(link).toHaveAttribute("href", "https://example.com/changelog");
    expect(link).toHaveAttribute("data-slot", "badge");
    expect(link.querySelector('[data-slot="badge-dot"]')).not.toBeNull();
  });

  it("only styles hover when rendered as a link", () => {
    const classes = badgeVariants({ variant: "secondary" }).split(" ");
    const hover = classes.filter((c) => c.includes("hover:"));

    expect(hover.length).toBeGreaterThan(0);
    for (const c of hover) expect(c.startsWith("[a&]:hover:")).toBe(true);
  });

  it("merges a custom className", () => {
    render(<Badge className="font-mono">v2</Badge>);

    expect(screen.getByText("v2")).toHaveClass("font-mono", "rounded-sm");
  });
});
