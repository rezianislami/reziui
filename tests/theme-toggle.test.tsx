import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/docs/theme-toggle";

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
});
