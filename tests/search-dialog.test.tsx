import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SearchResultItem } from "fumadocs-core/search/client";
import { browseResults, groupResults, SearchDialog } from "@/components/docs/search-dialog";
import type { BrowseGroup } from "@/lib/docs-index";

const search = vi.hoisted(() => ({
  state: { search: "", isLoading: false, data: undefined as unknown, error: undefined as Error | undefined },
  onSearchChange: vi.fn(),
  options: undefined as unknown,
}));
const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("fumadocs-core/search/client", () => ({
  useStaticSearch: (options: unknown) => {
    search.options = options;
    return { ...search.state, onSearchChange: search.onSearchChange };
  },
}));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const pageTitles = { "/docs/components/button": "Button" };

const items = [
  { id: "p1", type: "page", url: "/docs/components/button", content: "Button", breadcrumbs: ["Docs", "Components"] },
  { id: "h1", type: "heading", url: "/docs/components/button#sizes", content: "Sizes" },
  { id: "h2", type: "heading", url: "/docs/components/button#loading", content: "Loading" },
  { id: "t1", type: "text", url: "/docs/components/button", content: "| Prop | Type |" },
  { id: "tb", type: "table", columns: 2 },
] as unknown as SearchResultItem[];

const browse: BrowseGroup[] = [
  { label: "Getting started", pages: [{ url: "/docs", title: "Introduction" }] },
  {
    label: "Components",
    pages: [
      { url: "/docs/components/button", title: "Button" },
      { url: "/docs/components/switch", title: "Switch" },
    ],
  },
];

function openEmpty(props: Partial<React.ComponentProps<typeof SearchDialog>> = {}) {
  render(<SearchDialog pageTitles={pageTitles} browse={browse} {...props} />);
  fireEvent.keyDown(window, { key: "k", metaKey: true });
  return screen.getByRole("combobox", { name: "Search docs" });
}

async function openWithResults() {
  search.state = { search: "button", isLoading: false, data: { query: "button", items }, error: undefined };
  render(<SearchDialog pageTitles={pageTitles} />);
  fireEvent.keyDown(window, { key: "k", metaKey: true });
  return screen.getByRole("combobox", { name: "Search docs" });
}

describe("groupResults", () => {
  it("groups pages before headings and drops text and table hits", () => {
    const groups = groupResults(items, pageTitles);

    expect(groups.map((g) => g.label)).toEqual(["Pages", "Headings"]);
    expect(groups[0].hits.map((h) => h.id)).toEqual(["p1"]);
    expect(groups[1].hits.map((h) => h.id)).toEqual(["h1", "h2"]);
  });

  it("labels pages with their section and headings with their page title", () => {
    const [pages, headings] = groupResults(items, pageTitles);

    expect(pages.hits[0].context).toBe("Components");
    expect(headings.hits[0].context).toBe("Button");
  });

  it("omits empty groups and leaves context undefined for unknown pages", () => {
    const groups = groupResults(
      [{ id: "h", type: "heading", url: "/docs/missing#x", content: "X" }] as unknown as SearchResultItem[],
      pageTitles,
    );

    expect(groups.map((g) => g.label)).toEqual(["Headings"]);
    expect(groups[0].hits[0].context).toBeUndefined();
  });
});

describe("SearchDialog", () => {
  beforeEach(() => {
    search.state = { search: "", isLoading: false, data: undefined, error: undefined };
    search.onSearchChange.mockReset();
    router.push.mockReset();
  });

  it("toggles with Cmd+K and Ctrl+K but not a plain k", () => {
    render(<SearchDialog pageTitles={pageTitles} />);

    fireEvent.keyDown(window, { key: "k" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog", { name: "Search documentation" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "K", ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("downloads the index from the route the static export emits", () => {
    render(<SearchDialog pageTitles={pageTitles} />);

    expect(search.options).toMatchObject({ from: "/api/search" });
    expect(existsSync(resolve(process.cwd(), "app/api/search/route.ts"))).toBe(true);
  });

  it("forwards typed queries to the search hook", async () => {
    render(<SearchDialog pageTitles={pageTitles} />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    await userEvent.type(screen.getByRole("combobox", { name: "Search docs" }), "b");

    expect(search.onSearchChange).toHaveBeenCalledWith("b");
  });

  it("renders grouped options and selects the first one", async () => {
    await openWithResults();

    expect(screen.getByRole("group", { name: "Pages" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Headings" })).toBeInTheDocument();
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("moves the selection with arrow keys and wraps around", async () => {
    const input = await openWithResults();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", "search-hit-h1");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(screen.getAllByRole("option")[2]).toHaveAttribute("aria-selected", "true");
  });

  it("navigates to the selected hit on Enter and closes", async () => {
    const input = await openWithResults();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(router.push).toHaveBeenCalledWith("/docs/components/button#sizes");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates when an option is clicked", async () => {
    await openWithResults();

    await userEvent.click(screen.getByRole("option", { name: /Loading/ }));

    expect(router.push).toHaveBeenCalledWith("/docs/components/button#loading");
  });

  it("shows an empty state for a query without results", () => {
    search.state = { search: "zzz", isLoading: false, data: { query: "zzz", items: [] }, error: undefined };
    render(<SearchDialog pageTitles={pageTitles} />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(screen.getByText(/No results for/)).toBeInTheDocument();
  });

  it("explains when the search request failed", () => {
    search.state = { search: "button", isLoading: false, data: undefined, error: new Error("500") };
    render(<SearchDialog pageTitles={pageTitles} />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(screen.getByRole("alert")).toHaveTextContent(/Search is unavailable/);
    expect(screen.queryByText(/No results for/)).not.toBeInTheDocument();
  });

  describe("before anything is typed", () => {
    it("lists every page on one line, grouped like the sidebar, without a second line", () => {
      const input = openEmpty();

      expect(screen.getAllByRole("group").map((g) => g.getAttribute("aria-label"))).toEqual(["Getting started", "Components"]);
      expect(screen.getAllByRole("option")).toHaveLength(3);
      // The group label already names the section, so pages carry no context.
      expect(screen.getByRole("option", { name: /Switch/ })).toHaveTextContent(/^Switch$/);
      expect(screen.getByRole("option", { name: /Switch/ })).toHaveClass("h-9");
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("selects the first page and opens it with arrow keys and Enter", async () => {
      const input = openEmpty();

      expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");
      await userEvent.type(input, "{ArrowDown}{ArrowDown}{Enter}");

      expect(router.push).toHaveBeenCalledWith("/docs/components/switch");
    });

    it("keeps the selected option scrolled into view while arrowing through a long list", async () => {
      // Regression: the selection moved below the 360px list without scrolling.
      const scrolled: string[] = [];
      const scroll = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(function (this: Element) {
        scrolled.push(this.textContent ?? "");
      });
      const input = openEmpty();

      await userEvent.type(input, "{ArrowDown}{ArrowDown}");

      expect(scrolled.at(-1)).toMatch(/^Switch/);
      expect(scroll).toHaveBeenLastCalledWith({ block: "nearest" });
      scroll.mockRestore();
    });

    it("rings the selected option after arrow-key navigation, not after a pointer move", async () => {
      // Regression: the selection was bg-accent only, 1.09:1 against the
      // dialog — too faint to follow with the keyboard.
      const ring = "outline-ring";
      const input = openEmpty();
      const selected = () => screen.getAllByRole("option").find((o) => o.getAttribute("aria-selected") === "true")!;

      expect(selected()).not.toHaveClass(ring);
      await userEvent.type(input, "{ArrowDown}");
      expect(selected()).toHaveClass("outline-2", "outline-solid", "-outline-offset-2", ring);

      fireEvent.mouseMove(screen.getByRole("option", { name: /Switch/ }));
      expect(selected()).toHaveTextContent("Switch");
      expect(selected()).not.toHaveClass(ring);
    });

    it("labels new pages, read as part of the option name", () => {
      openEmpty({ newUrls: ["/docs/components/switch"] });

      expect(screen.getByRole("option", { name: /Switch, new/ })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Button/ })).not.toHaveTextContent("New");
      expect(screen.getByText("New")).toHaveAttribute("aria-hidden", "true");
    });

    it("treats a whitespace-only query as empty", () => {
      search.state = { search: "   ", isLoading: false, data: undefined, error: undefined };
      openEmpty();

      expect(screen.getAllByRole("option")).toHaveLength(3);
      expect(screen.queryByText(/No results for/)).not.toBeInTheDocument();
    });

    it("keeps a heading's page as muted context at the end of its single line", () => {
      search.state = { search: "button", isLoading: false, data: { query: "button", items }, error: undefined };
      openEmpty();

      const sizes = screen.getByRole("option", { name: /Sizes/ });
      expect(sizes).toHaveClass("h-9");
      const context = sizes.querySelector(".text-end");
      expect(context).toHaveTextContent("Button");
      expect(context).toHaveClass("truncate", "text-muted-foreground");
    });

    it("replaces the list with search results once a query is typed", async () => {
      search.state = { search: "button", isLoading: false, data: { query: "button", items }, error: undefined };
      openEmpty();

      expect(screen.queryByRole("group", { name: "Getting started" })).toBeNull();
      expect(screen.getByRole("group", { name: "Headings" })).toBeInTheDocument();
    });
  });
});

describe("browseResults", () => {
  it("turns every browse page into a page hit with a unique id", () => {
    const groups = browseResults(browse);
    const hits = groups.flatMap((g) => g.hits);

    expect(hits.map((h) => h.type)).toEqual(["page", "page", "page"]);
    expect(new Set(hits.map((h) => h.id)).size).toBe(3);
    expect(hits[1]).toMatchObject({ url: "/docs/components/button", title: "Button" });
    expect(hits[1].context).toBeUndefined();
  });

  it("returns nothing for an empty catalog", () => {
    expect(browseResults([])).toEqual([]);
  });
});
