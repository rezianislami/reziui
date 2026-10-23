import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import registry from "@/registry.json";
import { InstallCommand, ROTATION, ROTATION_START_MS, ROTATION_STEP_MS } from "@/components/docs/install-command";
import { SpotlightGrid } from "@/components/landing/spotlight-grid";
import { ShowcaseCard } from "@/components/landing/showcase-card";
import { componentCount, everyday, recentlyAdded } from "@/components/landing/showcases";

describe("landing data", () => {
  it("counts components from the registry, not a hard-coded number", () => {
    const ui = registry.items.filter((item) => item.type === "registry:ui");
    expect(componentCount).toBe(ui.length);
    expect(componentCount).toBeGreaterThan(0);
  });

  it("links every card to a docs page that exists", () => {
    for (const { slug } of [...recentlyAdded, ...everyday]) {
      expect(existsSync(join(process.cwd(), "content/docs/components", `${slug}.mdx`)), slug).toBe(true);
    }
  });

  it("shows each component once", () => {
    const slugs = [...recentlyAdded, ...everyday].map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

// The command is split between the rolling runner and the shared rest, so
// match on the whole <code> element's text.
const command = () => document.querySelector<HTMLElement>("pre code")!;
const runnerSlot = () => document.querySelector('[data-slot="runner"]')!;
// jsdom has no AnimationEvent, so React listens for the prefixed name there;
// send both, as a browser would send the standard one.
const endAnimation = (el: Element) => {
  fireEvent(el, new Event("animationend", { bubbles: true }));
  fireEvent(el, new Event("webkitAnimationEnd", { bubbles: true }));
};

describe("InstallCommand", () => {
  it("shows the npm command first and switches per package manager", async () => {
    render(<InstallCommand />);

    expect(command()).toHaveTextContent("npx shadcn@latest add @reziui/button");
    for (const [tab, text] of [
      ["pnpm", "pnpm dlx shadcn@latest add @reziui/button"],
      ["bun", "bunx --bun shadcn@latest add @reziui/button"],
      ["yarn", "yarn dlx shadcn@latest add @reziui/button"],
    ]) {
      await userEvent.click(screen.getByRole("tab", { name: tab }));
      endAnimation(runnerSlot().querySelector('[aria-hidden="true"]')!);
      expect(command()).toHaveTextContent(text);
    }
  });

  it("copies the command for the selected package manager", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<InstallCommand />);

    await userEvent.click(screen.getByRole("tab", { name: "bun" }));
    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(writeText).toHaveBeenCalledWith("bunx --bun shadcn@latest add @reziui/button");
  });

  it("rolls only the runner: the old one out the top, the new one in from below", async () => {
    render(<InstallCommand />);
    const rest = command().lastChild;

    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));

    const [incoming, leaving] = [...runnerSlot().children] as HTMLElement[];
    expect(incoming).toHaveTextContent("pnpm dlx");
    expect(incoming).toHaveClass("motion-safe:animate-in", "motion-safe:slide-in-from-bottom-full");
    expect(leaving).toHaveTextContent("npx");
    expect(leaving).toHaveClass("motion-safe:animate-out", "motion-safe:slide-out-to-top-full", "motion-reduce:hidden");
    // The shared rest of the command is the same node, untouched.
    expect(command().lastChild).toBe(rest);
  });

  it("drops the leaving runner once its animation ends", async () => {
    render(<InstallCommand />);

    await userEvent.click(screen.getByRole("tab", { name: "bun" }));
    expect(runnerSlot().children).toHaveLength(2);
    endAnimation(runnerSlot().children[1]);

    expect(runnerSlot().children).toHaveLength(1);
    expect(runnerSlot()).toHaveTextContent("bunx --bun");
  });

  it("does nothing when the current tab is chosen again", async () => {
    render(<InstallCommand />);

    await userEvent.click(screen.getByRole("tab", { name: "npm" }));

    expect(runnerSlot().children).toHaveLength(1);
  });

  it("keeps the command on one line and scrolls it on narrow screens", () => {
    render(<InstallCommand />);

    expect(command().closest("pre")).toHaveClass("overflow-x-auto");
  });
});

describe("InstallCommand colours", () => {
  it("colours each part of the command like the docs code blocks", async () => {
    render(<InstallCommand />);
    await userEvent.click(screen.getByRole("tab", { name: "bun" }));
    endAnimation(runnerSlot().children[1]);
    const code = command();

    expect(within(code).getByText("bunx")).toHaveClass("text-[#b34700]", "dark:text-[#ffab70]");
    expect(within(code).getByText(/--bun/)).toHaveClass("text-[#6f42c1]");
    expect(within(code).getByText(/add/)).toHaveClass("text-[#005cc5]");
    expect(within(code).getByText(/@reziui\//)).toHaveClass("text-muted-foreground");
    expect(within(code).getByText("button")).toHaveClass("text-[#032f62]", "dark:text-[#9ecbff]");
  });

  it("treats a runner's plain second word as a subcommand", () => {
    render(<InstallCommand />);

    expect(within(command()).getByText("npx")).toHaveClass("text-[#b34700]");
  });
});

describe("InstallCommand rotation", () => {
  let fire: ((visible: boolean) => void) | undefined;
  const observe = vi.fn();
  const setup = (reduce = false, name?: string) => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          fire = (visible) => cb([{ isIntersecting: visible } as IntersectionObserverEntry], this as never);
        }
        observe = observe;
        disconnect() {}
      },
    );
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce") }));
    render(<InstallCommand name={name} />);
  };
  const item = () => document.querySelector('[data-slot="item"]')!.firstElementChild!.textContent;

  afterEach(() => {
    observe.mockClear();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    fire = undefined;
  });

  it("rotates once through the names after it scrolls into view, then settles on button", () => {
    setup();
    expect(item()).toBe("button");
    expect(observe).toHaveBeenCalledTimes(1);

    act(() => fire!(true));
    act(() => vi.advanceTimersByTime(ROTATION_START_MS));
    expect(item()).toBe(ROTATION[1]);
    act(() => vi.advanceTimersByTime(ROTATION_STEP_MS));
    expect(item()).toBe(ROTATION[2]);
    act(() => vi.advanceTimersByTime(ROTATION_STEP_MS));
    expect(item()).toBe("button");
    act(() => vi.advanceTimersByTime(10_000));
    expect(item()).toBe("button");
  });

  it("finishes in under five seconds, so it needs no pause control", () => {
    expect(ROTATION_START_MS + (ROTATION.length - 2) * ROTATION_STEP_MS).toBeLessThan(5000);
  });

  it("waits until the block is on screen", () => {
    setup();

    act(() => fire!(false));
    act(() => vi.advanceTimersByTime(5000));

    expect(item()).toBe("button");
  });

  it("stops for good once the pointer reaches the block", () => {
    setup();
    act(() => fire!(true));
    act(() => vi.advanceTimersByTime(ROTATION_START_MS));
    expect(item()).toBe("dialog");

    fireEvent.pointerEnter(command().closest("pre")!.parentElement!);
    act(() => vi.advanceTimersByTime(10_000));

    expect(item()).toBe("dialog");
  });

  it("copies the name that is showing", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setup();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    act(() => fire!(true));
    act(() => vi.advanceTimersByTime(ROTATION_START_MS));

    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(writeText).toHaveBeenCalledWith("npx shadcn@latest add @reziui/dialog");
  });

  it("keeps a fixed name on docs pages and never rotates", () => {
    setup(false, "sheet");

    expect(observe).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(10_000));
    expect(item()).toBe("sheet");
    expect(command().textContent).toBe("npx shadcn@latest add @reziui/sheet");
  });

  it("never rotates under reduced motion", () => {
    setup(true);

    expect(observe).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(10_000));
    expect(item()).toBe("button");
  });
});

describe("SpotlightGrid", () => {
  const renderGrid = () =>
    render(
      <SpotlightGrid>
        <article className="spotlight" data-testid="card">
          <span data-testid="inner">Preview</span>
        </article>
      </SpotlightGrid>,
    );

  it("moves the light to the pointer's position inside the hovered card", () => {
    renderGrid();
    const card = screen.getByTestId("card");
    card.getBoundingClientRect = () => ({ left: 100, top: 50, width: 300, height: 300 }) as DOMRect;

    fireEvent.pointerMove(screen.getByTestId("inner"), { pointerType: "mouse", clientX: 160, clientY: 90 });

    expect(card.style.getPropertyValue("--spot-x")).toBe("60px");
    expect(card.style.getPropertyValue("--spot-y")).toBe("40px");
  });

  it("ignores touch, which has no hover to follow", () => {
    renderGrid();

    fireEvent.pointerMove(screen.getByTestId("inner"), { pointerType: "touch", clientX: 10, clientY: 10 });

    expect(screen.getByTestId("card").style.getPropertyValue("--spot-x")).toBe("");
  });
});

describe("ShowcaseCard", () => {
  it("links the title to the docs and leaves the preview interactive", () => {
    render(
      <ShowcaseCard title="Sheet" description="Panel." href="/docs/components/sheet">
        <button type="button">Filters</button>
      </ShowcaseCard>,
    );

    expect(screen.getByRole("link", { name: "Sheet" })).toHaveAttribute("href", "/docs/components/sheet");
    expect(screen.getByRole("button", { name: "Filters" }).closest("a")).toBeNull();
  });

  it("labels new components, read as part of the title", () => {
    render(
      <ShowcaseCard title="Sheet" description="Panel." href="/docs/components/sheet" isNew>
        <span />
      </ShowcaseCard>,
    );

    expect(screen.getByRole("heading", { name: "Sheet, new" })).toBeInTheDocument();
    expect(screen.getByText("New")).toHaveAttribute("aria-hidden", "true");
  });

  it("takes the reveal and spotlight classes and its column, and marks the preview layer", () => {
    const { container } = render(
      <ShowcaseCard
        title="Kbd"
        description="Keys."
        href="/docs/components/kbd"
        className="scroll-reveal spotlight"
        style={{ "--col-lg": 2 } as React.CSSProperties}
      >
        <span />
      </ShowcaseCard>,
    );
    const card = container.firstElementChild as HTMLElement;

    expect(card).toHaveClass("scroll-reveal", "spotlight", "relative", "rounded-[1rem]");
    expect(card.style.getPropertyValue("--col-lg")).toBe("2");
    expect(card.firstElementChild).toHaveAttribute("data-reveal", "preview");
  });

  it("insets the preview with concentric radii: 16 outside, 8 inside", () => {
    const { container } = render(
      <ShowcaseCard title="Kbd" description="Keys." href="/docs/components/kbd">
        <span />
      </ShowcaseCard>,
    );

    expect(container.firstElementChild).toHaveClass("rounded-[1rem]");
    expect(container.firstElementChild!.firstElementChild).toHaveClass("m-2", "rounded-md", "bg-background");
    // 12px padding leaves 251px inside a 291px card: the widest preview (the
    // Tabs list, 246px) overflowed the 243px that 16px padding left.
    expect(container.firstElementChild!.firstElementChild).toHaveClass("p-3");
  });
});
