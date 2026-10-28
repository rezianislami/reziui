import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/docs/theme-toggle";
import { TooltipProvider } from "@/registry/reziui/ui/tooltip";
import { sweepTheme } from "@/lib/theme-sweep";

// jsdom has no View Transitions; the tests add and remove a stub.
type Doc = { startViewTransition?: unknown };

function stubViewTransition() {
  const animate = vi.fn();
  document.documentElement.animate = animate as unknown as typeof document.documentElement.animate;
  const start = vi.fn((cb: () => void) => {
    cb();
    return { ready: Promise.resolve(), finished: Promise.resolve() };
  });
  (document as unknown as Doc).startViewTransition = start;
  return { start, animate };
}

function stubReducedMotion(reduce: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: reduce && query.includes("reduce"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
      }) as unknown as MediaQueryList,
  );
}

afterEach(() => {
  delete (document as unknown as Doc).startViewTransition;
  vi.restoreAllMocks();
  document.documentElement.classList.remove("dark", "light");
});

describe("sweepTheme", () => {
  it("switches straight away where View Transitions aren't supported", () => {
    const setTheme = vi.fn();

    sweepTheme("dark", setTheme, { x: 10, y: 10 });

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches straight away under reduced motion, without starting a transition", () => {
    const { start } = stubViewTransition();
    stubReducedMotion(true);
    const setTheme = vi.fn();

    sweepTheme("dark", setTheme, { x: 10, y: 10 });

    expect(start).not.toHaveBeenCalled();
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("applies the new theme inside the transition, so the new snapshot is already in it", () => {
    stubViewTransition();
    stubReducedMotion(false);
    const setTheme = vi.fn();

    sweepTheme("dark", setTheme, { x: 10, y: 10 });

    expect(setTheme).toHaveBeenCalledWith("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("hands the stylesheet the origin and a radius that clears the farthest corner, feather included", () => {
    stubViewTransition();
    stubReducedMotion(false);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

    sweepTheme("light", vi.fn(), { x: 900, y: 20 });

    // Farthest corner from (900, 20) is (0, 800): hypot(900, 780) ≈ 1191,
    // plus the 48px soft edge so the edge itself is past the corner too.
    const style = document.documentElement.style;
    expect(style.getPropertyValue("--sweep-x")).toBe("900px");
    expect(style.getPropertyValue("--sweep-y")).toBe("20px");
    expect(style.getPropertyValue("--sweep-end")).toBe("1239px");
  });

  it("clears the sweep variables once the transition has finished", async () => {
    const animate = vi.fn();
    document.documentElement.animate = animate as unknown as typeof document.documentElement.animate;
    let finish!: () => void;
    (document as unknown as Doc).startViewTransition = (cb: () => void) => {
      cb();
      return { ready: Promise.resolve(), finished: new Promise<void>((r) => (finish = r)) };
    };
    stubReducedMotion(false);

    sweepTheme("dark", vi.fn(), { x: 10, y: 10 });
    expect(document.documentElement.style.getPropertyValue("--sweep-end")).not.toBe("");

    finish();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.documentElement.style.getPropertyValue("--sweep-end")).toBe("");
  });
});

describe("ThemeToggle (site)", () => {
  it("is the same labelled ghost button and flips light to dark", async () => {
    // next-themes subscribes to the colour-scheme query, so the stub needs
    // the legacy listener methods too.
    stubReducedMotion(false);
    const user = userEvent.setup();
    render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <ThemeToggle />
        </TooltipProvider>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(document.documentElement).toHaveClass("dark");
  });
});
