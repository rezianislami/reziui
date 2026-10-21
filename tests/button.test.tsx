import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonVariants } from "@/registry/reziui/ui/button";

describe("Button", () => {
  it("renders a native button with default variant and size", () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
    expect(button).toHaveClass("rounded-full", "h-9", "px-4");
  });

  it("fires onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["default", "from-(--btn-primary-from)"],
    ["secondary", "bg-secondary"],
    ["outline", "bg-transparent"],
    ["ghost", "not-disabled:hover:bg-accent"],
    ["destructive", "from-(--btn-destructive-from)"],
    ["destructive-secondary", "text-(--destructive-text)"],
    ["link", "text-(--link)"],
  ] as const)("applies the %s variant classes", (variant, expected) => {
    render(<Button variant={variant}>Label</Button>);

    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it.each([
    ["xs", "h-5"],
    ["sm", "h-6.5"],
    ["lg", "h-10"],
    ["icon-xs", "size-5"],
    ["icon", "size-9"],
  ] as const)("applies the %s size", (size, expected) => {
    render(
      <Button size={size} aria-label="Add">
        +
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Add" })).toHaveClass(expected);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables the button and shows a spinner while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Saving" });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    // Spins only when motion is allowed; aria-busy carries the state otherwise.
    expect(button.querySelector("svg")).toHaveClass("motion-safe:animate-spin");
    expect(button.querySelector("svg")).not.toHaveClass("animate-spin");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("scales on press unless static, and only when motion is allowed", () => {
    render(
      <>
        <Button>Pressable</Button>
        <Button static>Still</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Pressable" })).toHaveClass("motion-safe:not-disabled:active:scale-[0.96]");
    expect(screen.getByRole("button", { name: "Still" })).not.toHaveClass("motion-safe:not-disabled:active:scale-[0.96]");
  });

  it("focuses with an offset outline, never a box-shadow ring", () => {
    for (const variant of ["default", "secondary", "destructive"] as const) {
      const classes = buttonVariants({ variant }).split(" ");
      expect(classes, variant).toEqual(
        // outline-solid is required: outline-hidden sets --tw-outline-style to none,
        // so outline-2 alone draws nothing.
        expect.arrayContaining(["outline-hidden", "focus-visible:outline-2", "focus-visible:outline-solid", "focus-visible:outline-offset-2", "focus-visible:outline-ring"]),
      );
      expect(classes.some((c) => c.startsWith("focus-visible:ring")), variant).toBe(false);
    }
  });

  it("extends the 20px sizes to a 24px hit area", () => {
    for (const size of ["xs", "icon-xs"] as const) {
      expect(buttonVariants({ size }).split(" "), size).toEqual(expect.arrayContaining(["relative", "after:absolute", "after:-inset-0.5"]));
    }
  });

  it("renders the child element with asChild", () => {
    render(
      <Button asChild variant="secondary">
        <a href="https://example.com">Docs</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveClass("bg-secondary");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not inject a spinner into an asChild element while loading", () => {
    render(
      <Button asChild loading>
        <a href="https://example.com">Docs</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("data-loading", "true");
    expect(link.querySelector("svg")).toBeNull();
  });

  it("gates hover styles so disabled buttons do not react", () => {
    const classes = buttonVariants({ variant: "secondary" });

    expect(classes).toContain("not-disabled:hover:bg-accent");
    expect(classes.split(" ")).not.toContain("hover:bg-accent");
  });

  it.each(["default", "destructive"] as const)(
    "keeps the %s variant independent of the consumer's shared color tokens",
    (variant) => {
      // A theme pulled in as a registry dependency never overwrites an
      // existing --primary / --destructive, so emphasis buttons must not read them.
      const classes = buttonVariants({ variant }).split(" ");
      const shared = /^(?:[\w-]+:)*(?:bg|from|to|text|ring)-(?:primary|primary-foreground|destructive)$/;

      expect(classes.filter((c) => shared.test(c))).toEqual([]);
      expect(classes).toContain("text-white");
    },
  );

  it("merges a custom className", () => {
    render(<Button className="w-full">Save</Button>);

    expect(screen.getByRole("button")).toHaveClass("w-full", "rounded-full");
  });
});
