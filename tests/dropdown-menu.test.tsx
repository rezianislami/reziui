import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/reziui/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/reziui/ui/popover";

function Actions({ onRename = () => {}, onDelete = () => {} }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onRename}>
          <svg data-testid="icon" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Options() {
  const [bar, setBar] = useState(true);
  const [position, setPosition] = useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>View</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={bar} onCheckedChange={setBar}>
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const open = (name: string) => userEvent.click(screen.getByRole("button", { name }));

describe("DropdownMenu", () => {
  it("opens a menu of items and runs the selected one", async () => {
    const onRename = vi.fn();
    render(<Actions onRename={onRename} />);

    await open("Actions");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));

    expect(onRename).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("supports the keyboard: arrows skip disabled items, Enter selects", async () => {
    const onDelete = vi.fn();
    render(<Actions onDelete={onDelete} />);

    screen.getByRole("button", { name: "Actions" }).focus();
    await userEvent.keyboard("{Enter}");
    // Rename is first; Duplicate is disabled, so one more arrow reaches Delete.
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("returns focus to the trigger on Escape", async () => {
    render(<Actions />);
    const trigger = screen.getByRole("button", { name: "Actions" });

    await open("Actions");
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("marks the destructive variant and colors its icon to match", async () => {
    render(<Actions />);
    await open("Actions");

    const item = screen.getByRole("menuitem", { name: "Delete" });
    expect(item).toHaveAttribute("data-variant", "destructive");
    expect(item).toHaveClass("data-[variant=destructive]:text-(--destructive-text)");
  });

  it("toggles checkbox items and keeps one radio item checked", async () => {
    render(<Options />);

    await open("View");
    expect(screen.getByRole("menuitemcheckbox", { name: "Status bar" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("menuitemcheckbox", { name: "Status bar" }));

    await open("View");
    expect(screen.getByRole("menuitemcheckbox", { name: "Status bar" })).toHaveAttribute("aria-checked", "false");
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Top" }));

    await open("View");
    expect(screen.getByRole("menuitemradio", { name: "Top" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Bottom" })).toHaveAttribute("aria-checked", "false");
  });

  it("starts every item's text at 32px: icon items and indicator items line up", async () => {
    render(<Options />);
    await open("View");

    for (const item of [...screen.getAllByRole("menuitemcheckbox"), ...screen.getAllByRole("menuitemradio")]) {
      expect(item).toHaveClass("ps-8");
    }
  });

  it("paints the system highlight in forced-colors mode and highlights instantly", async () => {
    render(<Actions />);
    await open("Actions");

    const item = screen.getByRole("menuitem", { name: "Rename" });
    expect(item).toHaveClass("data-highlighted:bg-accent", "forced-colors:data-highlighted:bg-[Highlight]");
    expect(item.className).not.toMatch(/transition/);
  });

  it("rings the highlighted item for keyboard users only, since the accent fill is under 3:1", async () => {
    // Regression: the only highlight was bg-accent, 1.09:1 against the menu in
    // light mode — too faint to follow with the keyboard. :focus-visible can't
    // tell them apart (Chrome matches it for hover-driven focus in a menu), so
    // the content records the last input as data-nav.
    render(<Actions />);
    await open("Actions");
    const menu = screen.getByRole("menu");
    const item = screen.getByRole("menuitem", { name: "Rename" });

    expect(item).toHaveClass("data-highlighted:outline-2", "data-highlighted:outline-solid", "data-highlighted:outline-ring");
    expect(item).toHaveClass("group-data-[nav=pointer]/menu:data-highlighted:outline-none");
    expect(item.className).not.toMatch(/focus-visible:outline-ring/);

    fireEvent.pointerMove(item, { pointerType: "mouse" });
    expect(menu).toHaveAttribute("data-nav", "pointer");

    await userEvent.keyboard("{ArrowDown}");
    expect(menu).toHaveAttribute("data-nav", "keyboard");
  });

  it("still calls the consumer's own key and pointer handlers", async () => {
    const onKeyDown = vi.fn();
    const onPointerMove = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent onKeyDown={onKeyDown} onPointerMove={onPointerMove}>
          <DropdownMenuItem>One</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await open("Open");

    fireEvent.pointerMove(screen.getByRole("menuitem"), { pointerType: "mouse" });
    await userEvent.keyboard("{ArrowDown}");

    expect(onPointerMove).toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("uses exactly the popover's overlay surface and motion", async () => {
    render(
      <>
        <Actions />
        <Popover>
          <PopoverTrigger>Info</PopoverTrigger>
          <PopoverContent>Body</PopoverContent>
        </Popover>
      </>,
    );
    await open("Info");
    const popover = document.querySelector('[data-slot="popover-content"]')!;
    const shared = [...popover.classList].filter((c) => !["w-72", "p-4", "text-sm"].includes(c) && !c.startsWith("origin-"));
    await userEvent.keyboard("{Escape}");
    await open("Actions");
    const menu = document.querySelector('[data-slot="dropdown-menu-content"]')!;

    expect(shared.length).toBeGreaterThan(10);
    expect(menu).toHaveClass(...shared);
  });
});
