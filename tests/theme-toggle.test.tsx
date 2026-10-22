import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/docs/theme-toggle";

const theme = vi.hoisted(() => ({ theme: "light" as string | undefined, setTheme: vi.fn() }));
vi.mock("next-themes", () => ({ useTheme: () => theme }));

describe("ThemeToggle", () => {
  beforeEach(() => {
    theme.setTheme.mockReset();
    theme.theme = "light";
  });

  it("opens a menu with light, dark and system, marking the current choice", async () => {
    theme.theme = "dark";
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Theme" }));

    const options = screen.getAllByRole("menuitemradio");
    expect(options.map((o) => o.textContent)).toEqual(["Light", "Dark", "System"]);
    expect(screen.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
  });

  it("switches theme from the menu", async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Theme" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));

    expect(theme.setTheme).toHaveBeenCalledWith("dark");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("can go back to following the system theme", async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Theme" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "System" }));

    expect(theme.setTheme).toHaveBeenCalledWith("system");
  });

  it("is operable from the keyboard", async () => {
    render(<ThemeToggle />);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(theme.setTheme).toHaveBeenCalledWith("system");
  });

  it("checks nothing before the theme is known", async () => {
    // next-themes reports no theme on the first client render (before mount).
    theme.theme = undefined;
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Theme" }));

    for (const option of screen.getAllByRole("menuitemradio")) {
      expect(option).toHaveAttribute("aria-checked", "false");
    }
  });

  it("labels the icon-only button with a tooltip on keyboard focus", async () => {
    render(<ThemeToggle />);

    await userEvent.tab();

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Theme");
  });
});
