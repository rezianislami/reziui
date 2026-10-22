import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/reziui/ui/dropdown-menu";
import { Label } from "@/registry/reziui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/reziui/ui/select";

function Framework({ invalid = false }) {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Label htmlFor="fw">Framework</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id="fw" aria-invalid={invalid || undefined}>
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="kit" disabled>
            SvelteKit
          </SelectItem>
        </SelectContent>
      </Select>
      <output data-testid="value">{value ?? ""}</output>
    </>
  );
}

const trigger = () => screen.getByRole("combobox", { name: "Framework" });

describe("Select", () => {
  it("is a labelled combobox showing a muted placeholder until something is chosen", () => {
    render(<Framework />);

    expect(trigger()).toHaveTextContent("Select a framework");
    expect(trigger()).toHaveAttribute("data-placeholder");
    expect(trigger()).toHaveClass("data-placeholder:text-muted-foreground");
  });

  it("opens a listbox and selects an option with the keyboard", async () => {
    render(<Framework />);

    trigger().focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(screen.getByTestId("value")).toHaveTextContent("remix");
    expect(trigger()).toHaveTextContent("Remix");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("skips disabled options and marks the chosen one", async () => {
    render(<Framework />);
    trigger().focus();
    await userEvent.keyboard("{Enter}");

    expect(screen.getByRole("option", { name: "SvelteKit" })).toHaveAttribute("aria-disabled", "true");
    await userEvent.keyboard("{Enter}");
    trigger().focus();
    await userEvent.keyboard("{Enter}");

    expect(screen.getByRole("option", { name: "Next.js" })).toHaveAttribute("aria-selected", "true");
  });

  it("looks like Input: 36px, radius 8, ring, outline focus, destructive when invalid", () => {
    render(<Framework invalid />);

    expect(trigger()).toHaveClass(
      "h-9",
      "w-full",
      "rounded-md",
      "ring-input",
      "focus-visible:outline-solid",
      "aria-invalid:ring-destructive",
    );
  });

  it("opens below the trigger as a popper at least as wide as it", async () => {
    render(<Framework />);
    trigger().focus();
    await userEvent.keyboard("{Enter}");

    const content = document.querySelector('[data-slot="select-content"]')!;
    expect(content).toHaveClass("min-w-(--radix-select-trigger-width)");
    expect(content.querySelector("[data-radix-select-viewport]")).toHaveClass("p-1");
  });

  it("puts the check at the end so item text lines up with the trigger value", async () => {
    render(<Framework />);
    trigger().focus();
    await userEvent.keyboard("{Enter}");

    const item = screen.getByRole("option", { name: "Next.js" });
    expect(item).toHaveClass("ps-2", "pe-8");
    expect(item.querySelector(".absolute")).toHaveClass("end-2");
  });

  it("rings the highlighted option only while driven by the keyboard", async () => {
    render(<Framework />);
    trigger().focus();
    await userEvent.keyboard("{Enter}");
    const content = document.querySelector('[data-slot="select-content"]')!;
    const item = screen.getByRole("option", { name: "Remix" });

    expect(item).toHaveClass("data-highlighted:outline-ring", "group-data-[nav=pointer]/select:data-highlighted:outline-none");
    fireEvent.pointerMove(item, { pointerType: "mouse" });
    expect(content).toHaveAttribute("data-nav", "pointer");
    await userEvent.keyboard("{ArrowDown}");
    expect(content).toHaveAttribute("data-nav", "keyboard");
  });

  it("uses exactly the dropdown menu's overlay surface and motion", async () => {
    render(
      <>
        <Framework />
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const menu = document.querySelector('[data-slot="dropdown-menu-content"]')!;
    const shared = [...menu.classList].filter((c) => c.startsWith("motion-safe:") || ["z-50", "rounded-[0.75rem]", "bg-popover", "shadow-(--shadow-overlay)", "ring", "ring-border"].includes(c));
    await userEvent.keyboard("{Escape}");
    trigger().focus();
    await userEvent.keyboard("{Enter}");

    expect(shared.length).toBeGreaterThan(10);
    expect(document.querySelector('[data-slot="select-content"]')).toHaveClass(...shared);
  });
});
