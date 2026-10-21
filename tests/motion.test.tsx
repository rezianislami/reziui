import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "@/registry/reziui/ui/badge";
import { Button } from "@/registry/reziui/ui/button";
import { Kbd } from "@/registry/reziui/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";
import { SearchDialog } from "@/components/docs/search-dialog";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("fumadocs-core/search/client", () => ({
  useFetchSearch: () => ({
    search: "",
    isLoading: false,
    data: undefined,
    error: undefined,
    onSearchChange: vi.fn(),
  }),
}));

// jsdom does no layout, so give each trigger a fake position and width.
function fakeLayout(triggers: HTMLElement[]) {
  triggers.forEach((trigger, i) => {
    Object.defineProperty(trigger, "offsetLeft", {
      configurable: true,
      get: () => 3 + i * 100,
    });
    Object.defineProperty(trigger, "offsetWidth", {
      configurable: true,
      get: () => 80 + i * 10,
    });
  });
}

describe("Tabs sliding indicator", () => {
  function renderTabs() {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Alpha</TabsTrigger>
          <TabsTrigger value="b">Beta</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
      </Tabs>,
    );
    return {
      list: screen.getByRole("tablist"),
      triggers: screen.getAllByRole("tab"),
    };
  }

  it("renders one shared indicator once the list is measured", () => {
    const { list } = renderTabs();

    expect(list).toHaveAttribute("data-indicator", "ready");
    expect(list.querySelectorAll('[data-slot="tabs-indicator"]')).toHaveLength(1);
    expect(list.querySelector('[data-slot="tabs-indicator"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("moves the indicator to the newly active trigger", async () => {
    const { list, triggers } = renderTabs();
    fakeLayout(triggers);

    await userEvent.click(screen.getByRole("tab", { name: "Beta" }));

    await waitFor(() => {
      const indicator = list.querySelector<HTMLElement>('[data-slot="tabs-indicator"]')!;
      expect(indicator.style.transform).toBe("translateX(103px)");
      expect(indicator.style.width).toBe("90px");
    });
  });

  it("hands the pill from the active trigger to the indicator, and animates only with motion allowed", () => {
    const { list, triggers } = renderTabs();
    const indicator = list.querySelector('[data-slot="tabs-indicator"]')!;

    // Trigger keeps a self-painted pill as the pre-hydration fallback…
    expect(triggers[0]).toHaveClass("data-[state=active]:bg-card");
    // …and drops it once the indicator is ready.
    expect(triggers[0]).toHaveClass("group-data-[indicator=ready]/tabs-list:data-[state=active]:bg-transparent");
    expect(indicator.className).toMatch(/motion-safe:transition-\[transform,width\]/);
  });

  it("forwards a ref to the list element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Tabs defaultValue="a">
        <TabsList
          ref={(el) => {
            node = el;
          }}
        >
          <TabsTrigger value="a">Alpha</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    expect(node).toBe(screen.getByRole("tablist"));
  });
});

describe("Badge pulse", () => {
  it("adds a dot with a ping ring that only animates when motion is allowed", () => {
    render(
      <Badge variant="warning" pulse>
        Building
      </Badge>,
    );

    const badge = screen.getByText("Building");
    const dot = badge.querySelector('[data-slot="badge-dot"]')!;
    expect(badge).toHaveAttribute("data-pulse", "true");
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(dot.firstElementChild).toHaveClass("motion-safe:animate-ping");
  });

  it("has no ring without pulse", () => {
    render(<Badge dot>Ready</Badge>);

    const dot = screen.getByText("Ready").querySelector('[data-slot="badge-dot"]')!;
    expect(dot.childElementCount).toBe(0);
  });
});

describe("Button success morph", () => {
  function Save() {
    const [saved, setSaved] = useState(false);
    return (
      <Button success={saved} onClick={() => setSaved(true)}>
        Save changes
      </Button>
    );
  }

  it("keeps the normal markup when success is not used", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button").querySelector('[data-slot="button-content"]')).toBeNull();
  });

  it("swaps the accessible name and announces the success label", async () => {
    render(<Save />);
    const button = screen.getByRole("button", { name: "Save changes" });

    await userEvent.click(button);

    expect(screen.getByRole("button", { name: "Saved" })).toBe(button);
    expect(button).toHaveAttribute("data-success", "true");
    expect(button.querySelector('[data-layer="idle"]')).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector('[aria-live="polite"]')).toHaveTextContent("Saved");
  });

  it("keeps only the active layer in flow, so the button hugs its label", () => {
    render(
      <Button success={false} successLabel="Copied">
        Copy
      </Button>,
    );

    const content = screen.getByRole("button").querySelector('[data-slot="button-content"]')!;
    const idle = content.querySelector('[data-layer="idle"]')!;
    const success = content.querySelector('[data-layer="success"]')!;
    expect(idle).toHaveAttribute("data-active", "true");
    expect(idle).not.toHaveClass("absolute");
    expect(success).toHaveClass("absolute", "opacity-0");
    expect(success).not.toHaveAttribute("data-active");
    // Name comes from the idle layer; the success copy stays out of it.
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("sizes the wrapper to the measured width of the active layer", () => {
    const widths: Record<string, number> = {
      idle: 92,
      loading: 16,
      success: 64,
    };
    const spy = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      return widths[this.dataset.layer ?? ""] ?? 0;
    });
    const { rerender } = render(<Button success={false}>Save changes</Button>);
    const content = () => screen.getByRole("button").querySelector<HTMLElement>('[data-slot="button-content"]')!;

    expect(content().style.width).toBe("92px");
    rerender(
      <Button success={false} loading>
        Save changes
      </Button>,
    );
    expect(content().style.width).toBe("16px");
    rerender(<Button success>Save changes</Button>);
    expect(content().style.width).toBe("64px");
    spy.mockRestore();
  });

  it("falls back to the natural width when nothing can be measured", () => {
    render(<Button success={false}>Save</Button>);

    expect(screen.getByRole("button").querySelector<HTMLElement>('[data-slot="button-content"]')!.style.width).toBe("");
  });

  it("turns into an icon-only circle while loading", () => {
    render(
      <Button loading success={false} size="sm">
        Save
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-morph", "true");
    expect(button).toHaveClass("data-loading:px-(--btn-px-icon)!", "[--btn-px-icon:--spacing(1.5)]");
  });

  it("does not add the circle padding to buttons without a success state", () => {
    render(<Button loading>Save</Button>);

    expect(screen.getByRole("button")).not.toHaveAttribute("data-morph");
    expect(screen.getByRole("button")).not.toHaveClass("data-loading:px-(--btn-px-icon)!");
  });

  it("does not layer with asChild", () => {
    render(
      <Button asChild success={false}>
        <a href="https://example.com">Link</a>
      </Button>,
    );

    expect(document.querySelector('[data-slot="button-content"]')).toBeNull();
  });

  it("shows loading as its own layer, keeping the button's name", () => {
    render(
      <Button loading success={false}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector('[data-layer="loading"]')).not.toHaveClass("opacity-0");
    expect(button.querySelector('[data-layer="idle"]')).toHaveClass("opacity-0");
    // Hidden visually only, so it still names the button.
    expect(button.querySelector('[data-layer="idle"]')).not.toHaveAttribute("aria-hidden");
    // No second spinner outside the layers.
    expect(button.querySelectorAll("svg.motion-safe\\:animate-spin, svg[class*='animate-spin']")).toHaveLength(1);
  });
});

describe("Kbd pressed", () => {
  it("marks the key pressed and drops it 1px", () => {
    render(<Kbd pressed>K</Kbd>);

    expect(screen.getByText("K")).toHaveAttribute("data-pressed", "true");
    expect(screen.getByText("K")).toHaveClass("data-pressed:translate-y-px", "data-pressed:border-b");
  });

  it("is up by default", () => {
    render(<Kbd>K</Kbd>);

    expect(screen.getByText("K")).not.toHaveAttribute("data-pressed");
  });

  it("echoes the real ⌘K shortcut on the docs search trigger", () => {
    render(<SearchDialog pageTitles={{}} />);
    const keys = () => screen.getAllByText(/^(⌘|K)$/).filter((el) => el.tagName === "KBD");

    fireEvent.keyDown(window, { key: "Meta", metaKey: true });
    expect(keys()[0]).toHaveAttribute("data-pressed", "true");
    expect(keys()[1]).not.toHaveAttribute("data-pressed");

    fireEvent.keyUp(window, { key: "Meta" });
    fireEvent(window, new Event("blur"));
    expect(keys().every((k) => !k.hasAttribute("data-pressed"))).toBe(true);
  });
});
