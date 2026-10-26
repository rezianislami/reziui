"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/reziui/ui/command";
import { Kbd, KbdGroup } from "@/registry/reziui/ui/kbd";

export default function CommandDialogDemo() {
  const [open, setOpen] = useState(false);

  // ⌘J here rather than ⌘K: these docs already use ⌘K for their own search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const run = () => setOpen(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open palette
        <KbdGroup aria-hidden="true">
          <Kbd>⌘</Kbd>
          <Kbd>J</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={run}>
              <CalendarIcon />
              Calendar
            </CommandItem>
            <CommandItem onSelect={run}>
              <SmileIcon />
              Search emoji
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={run}>
              <UserIcon />
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run}>
              <CreditCardIcon />
              Billing
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run}>
              <SettingsIcon />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
