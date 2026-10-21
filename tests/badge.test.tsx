import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "@/registry/reziui/ui/badge";

const variants = ["default", "outline", "success", "warning", "info", "destructive"] as const;

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
    for (const variant of variants) {
      expect(badgeVariants({ variant }).split(" ")).not.toContain("rounded-full");
    }
  });

  it("keeps every variant in one tinted family with a 1px inset ring", () => {
    for (const variant of variants) {
      expect(badgeVariants({ variant }).split(" "), variant).toEqual(expect.arrayContaining(["ring", "ring-inset"]));
    }
  });

  it("never uses the brand blue that means 'interactive'", () => {
    for (const variant of variants) {
      expect(badgeVariants({ variant }), variant).not.toMatch(/\b(bg|text|ring)-primary\b|--primary-|--btn-primary/);
    }
  });

  it.each([
    ["default", "bg-accent"],
    ["outline", "ring-border"],
    ["success", "bg-(--success-tint)"],
    ["warning", "text-(--warning-text)"],
    ["info", "ring-(--info-ring)"],
    ["destructive", "text-(--destructive-text)"],
  ] as const)("applies the %s variant classes", (variant, expected) => {
    render(<Badge variant={variant}>Label</Badge>);

    expect(screen.getByText("Label")).toHaveClass(expected);
  });

  it("renders the sm size on the small type step", () => {
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

  it("only styles hover and the enlarged hit area when rendered as a link", () => {
    const classes = badgeVariants({ variant: "default" }).split(" ");
    const linkOnly = classes.filter((c) => c.includes("hover:") || c.includes("after:"));

    expect(linkOnly.length).toBeGreaterThan(0);
    for (const c of linkOnly) expect(c.startsWith("[a&]:"), c).toBe(true);
  });

  it("uses an offset outline for focus so it survives forced-colors mode", () => {
    const classes = badgeVariants().split(" ");

    expect(classes).toEqual(expect.arrayContaining(["outline-hidden", "focus-visible:outline-2", "focus-visible:outline-solid", "focus-visible:outline-ring"]));
    expect(classes).not.toContain("outline-none");
  });

  it("uses logical padding for the leading icon so it mirrors in RTL", () => {
    expect(badgeVariants({ size: "default" })).toContain(":ps-1.5");
    expect(badgeVariants({ size: "default" })).not.toMatch(/:pl-/);
  });

  it("merges a custom className", () => {
    render(<Badge className="font-mono">v2</Badge>);

    expect(screen.getByText("v2")).toHaveClass("font-mono", "rounded-sm");
  });
});
