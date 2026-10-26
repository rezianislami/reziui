import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/reziui/ui/command";

function Palette({ onSelect = () => {} }: { onSelect?: (value: string) => void }) {
  return (
    <Command label="Commands">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={onSelect}>Calendar</CommandItem>
          <CommandItem onSelect={onSelect}>Search emoji</CommandItem>
          <CommandItem disabled onSelect={onSelect}>
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={onSelect} keywords={["account"]}>
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const input = () => screen.getByRole("combobox");
const option = (name: RegExp | string) => screen.getByRole("option", { name });
const selected = () => screen.getAllByRole("option").find((o) => o.getAttribute("aria-selected") === "true");

describe("Command", () => {
  it("is a combobox driving a labelled listbox of grouped options", () => {
    render(<Palette />);

    expect(input()).toHaveAttribute("placeholder", "Type a command or search…");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Suggestions")).toBeInTheDocument();
    expect(option(/Profile/)).toHaveTextContent("⌘P");
  });

  it("filters as you type, matching keywords too, and shows the empty message", async () => {
    render(<Palette />);

    await userEvent.type(input(), "cal");
    expect(screen.queryByRole("option", { name: "Search emoji" })).not.toBeInTheDocument();
    expect(option("Calendar")).toBeInTheDocument();

    await userEvent.clear(input());
    await userEvent.type(input(), "account");
    expect(option(/Profile/)).toBeInTheDocument();

    await userEvent.clear(input());
    await userEvent.type(input(), "xyz");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("moves the selection with the arrow keys, skipping disabled items, and runs it with Enter", async () => {
    const onSelect = vi.fn();
    render(<Palette onSelect={onSelect} />);
    await userEvent.click(input());

    expect(selected()).toHaveTextContent("Calendar");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(selected()).toHaveTextContent("Profile");
    expect(option("Calculator")).toHaveAttribute("aria-disabled", "true");

    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(expect.stringMatching(/profile/i));
  });

  it("rings the selection only while the keyboard drives it", async () => {
    render(<Palette />);
    const root = document.querySelector<HTMLElement>('[data-slot="command"]')!;
    // Untouched, nothing claims keyboard focus.
    expect(root).not.toHaveAttribute("data-nav");

    await userEvent.click(input());
    await userEvent.keyboard("{ArrowDown}");
    expect(root).toHaveAttribute("data-nav", "keyboard");

    await userEvent.pointer({ target: option("Calendar") });
    expect(root).toHaveAttribute("data-nav", "pointer");

    expect(option("Calendar")).toHaveClass(
      "data-[selected=true]:bg-accent",
      "group-data-[nav=keyboard]/command:data-[selected=true]:outline-2",
      "group-data-[nav=keyboard]/command:data-[selected=true]:outline-ring",
      "h-9",
      "rounded-md",
    );
  });

  it("puts the palette in a dialog with a screen-reader title and a larger input", async () => {
    render(
      <CommandDialog open onOpenChange={() => {}}>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem>Calendar</CommandItem>
        </CommandList>
      </CommandDialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Command palette" });
    expect(within(dialog).getByText("Search for a command to run.")).toBeInTheDocument();
    expect(within(dialog).getByRole("combobox")).toHaveFocus();
    expect(dialog.querySelector('[data-slot="command"]')).toHaveClass(
      "**:data-[slot=command-input-wrapper]:h-13",
      "**:data-[slot=command-input]:text-[15px]",
    );
  });
});
