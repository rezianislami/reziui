import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchDialog } from "@/components/docs/search-dialog";

const search = vi.hoisted(() => ({
  state: { search: "", isLoading: false, data: undefined as unknown },
  onSearchChange: vi.fn(),
}));

vi.mock("fumadocs-core/search/client", () => ({
  useFetchSearch: () => ({ ...search.state, onSearchChange: search.onSearchChange }),
}));

describe("SearchDialog", () => {
  beforeEach(() => {
    search.state = { search: "", isLoading: false, data: undefined };
    search.onSearchChange.mockReset();
  });

  it("opens with Cmd+K and Ctrl+K", () => {
    render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog", { name: "Search documentation" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "K", ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ignores a plain k keypress", () => {
    render(<SearchDialog />);

    fireEvent.keyDown(window, { key: "k" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards typed queries to the search hook", async () => {
    render(<SearchDialog />);
    await userEvent.click(screen.getByRole("button", { name: /Search docs/ }));

    await userEvent.type(screen.getByRole("textbox", { name: "Search docs" }), "b");

    expect(search.onSearchChange).toHaveBeenCalledWith("b");
  });

  it("lists page and heading results and skips table rows", async () => {
    search.state = {
      search: "button",
      isLoading: false,
      data: {
        query: "button",
        items: [
          { id: "1", type: "page", url: "/docs/components/button", content: "Button" },
          { id: "2", type: "heading", url: "/docs/components/button#sizes", content: "Sizes" },
          { id: "3", type: "table", columns: 2 },
        ],
      },
    };
    render(<SearchDialog />);
    await userEvent.click(screen.getByRole("button", { name: /Search docs/ }));

    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute("href", "/docs/components/button");
    expect(screen.getByRole("link", { name: "Sizes" })).toHaveAttribute("href", "/docs/components/button#sizes");
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("shows an empty state when a query has no results", async () => {
    search.state = { search: "zzz", isLoading: false, data: { query: "zzz", items: [] } };
    render(<SearchDialog />);
    await userEvent.click(screen.getByRole("button", { name: /Search docs/ }));

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});
