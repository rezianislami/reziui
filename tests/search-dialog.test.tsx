import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SearchResultItem } from "fumadocs-core/search/client";
import { groupResults, SearchDialog } from "@/components/docs/search-dialog";

const search = vi.hoisted(() => ({
  state: { search: "", isLoading: false, data: undefined as unknown, error: undefined as Error | undefined },
  onSearchChange: vi.fn(),
}));
const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("fumadocs-core/search/client", () => ({
  useFetchSearch: () => ({ ...search.state, onSearchChange: search.onSearchChange }),
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
});
