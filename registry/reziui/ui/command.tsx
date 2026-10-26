"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/registry/reziui/ui/dialog";

// cmdk owns filtering, ranking and the listbox semantics: focus stays in the
// input and aria-activedescendant points at the selected row. The rows match
// the docs search and the menus (36px, 8px radius inside 8px padding, so the
// corners stay concentric with a 16px dialog).
//
// data-nav records whether the list was last driven by keyboard or pointer,
// as in DropdownMenu, so the selected row gets the inset focus ring only when
// the keyboard put it there. Unlike a menu, which is usually opened from the
// keyboard, a command often sits on the page untouched with its first row
// selected, so the ring waits for an actual key press (unset means no ring).
// Written straight to the DOM: pointer moves fire constantly and shouldn't
// re-render the list.
function Command({ className, onKeyDown, onPointerMove, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      onKeyDown={(event) => {
        event.currentTarget.dataset.nav = "keyboard";
        onKeyDown?.(event);
      }}
      onPointerMove={(event) => {
        event.currentTarget.dataset.nav = "pointer";
        onPointerMove?.(event);
      }}
      className={cn(
        "group/command flex h-full w-full flex-col overflow-hidden rounded-[0.75rem] bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A Command in a Dialog, for the ⌘K palette. Open and close it yourself (for
 * example with a keydown listener for ⌘K / Ctrl+K). The title and description
 * are screen-reader only by default.
 */
function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run.",
  children,
  className,
  ...props
}: React.ComponentProps<typeof Dialog> & { title?: string; description?: string; className?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={false}
        className={cn("top-[12vh] max-h-none max-w-140 translate-y-0 overflow-hidden p-0", className)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* In the dialog the input grows to the docs search's 52px and 15px. */}
        <Command className="rounded-none bg-transparent **:data-[slot=command-input]:text-[15px] **:data-[slot=command-input-wrapper]:h-13">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-11 shrink-0 items-center gap-2.5 border-b border-(--hairline) ps-3.5 pe-3">
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full flex-1 bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[min(360px,60vh)] scroll-py-2 overflow-x-hidden overflow-y-auto p-2", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:leading-3.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-2 my-1 h-px bg-(--hairline)", className)}
      {...props}
    />
  );
}

// The selection switches instantly (it follows every pointer move). The accent
// fill is under 3:1, enough for hover but too faint to follow with the
// keyboard, so keyboard selection adds the inset 2px ring. Forced-colors mode
// drops backgrounds, so it paints the system Highlight pair instead. The icon
// darkens with the row so the selected one reads at a glance.
function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm text-foreground outline-hidden select-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        "data-[selected=true]:bg-accent data-[selected=true]:[&_svg:not([class*='text-'])]:text-foreground",
        "forced-colors:data-[selected=true]:bg-[Highlight] forced-colors:data-[selected=true]:text-[HighlightText]",
        "group-data-[nav=keyboard]/command:data-[selected=true]:outline-2 group-data-[nav=keyboard]/command:data-[selected=true]:-outline-offset-2 group-data-[nav=keyboard]/command:data-[selected=true]:outline-ring group-data-[nav=keyboard]/command:data-[selected=true]:outline-solid",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/** A keyboard shortcut at the end of a row, such as ⌘P. It only shows the key: bind it yourself. */
function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
