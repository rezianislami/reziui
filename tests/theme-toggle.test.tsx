import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/registry/reziui/ui/theme-toggle";

const theme = vi.hoisted(() => ({ resolvedTheme: "light" as string | undefined, setTheme: vi.fn() }));
vi.mock("next-themes", () => ({ useTheme: () => theme }));

describe("ThemeToggle", () => {
  beforeEach(() => {
    theme.setTheme.mockReset();
  });

  it("switches light to dark", async () => {
    theme.resolvedTheme = "light";
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(theme.setTheme).toHaveBeenCalledWith("dark");
  });

  it("labels the icon-only button with a tooltip on keyboard focus", async () => {
    render(<ThemeToggle />);

    await userEvent.tab();

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Toggle theme");
  });

  it("switches dark to light", async () => {
    theme.resolvedTheme = "dark";
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(theme.setTheme).toHaveBeenCalledWith("light");
  });

  it("falls back to dark before the theme is resolved", async () => {
    // resolvedTheme is undefined on the first client render (before mount).
    theme.resolvedTheme = undefined;
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(theme.setTheme).toHaveBeenCalledWith("dark");
  });

  it.each(["light", "dark", undefined])("renders the same markup whatever the resolved theme (%s)", (resolved) => {
    // Branching on resolvedTheme would make server and client HTML differ;
    // both icons must always render and only CSS may choose between them.
    theme.resolvedTheme = resolved;
    render(<ThemeToggle />);

    const icons = screen.getByRole("button", { name: "Toggle theme" }).querySelectorAll("svg");
    expect(icons).toHaveLength(2);
    expect(icons[0]).toHaveClass("dark:hidden");
    expect(icons[1]).toHaveClass("hidden", "dark:block");
  });
});
