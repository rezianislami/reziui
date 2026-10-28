"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

// Looks like Input — same height, radius, surface, ring and outline focus —
// so a form of inputs and selects reads as one set. Full width, like Input;
// pass a width class to size it to its content instead. A placeholder stays
// muted (data-placeholder is set by Radix while nothing is chosen).
function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md bg-card px-3 pb-px text-sm whitespace-nowrap text-foreground shadow-xs ring ring-input transition-[box-shadow] outline-hidden",
        "data-placeholder:text-muted-foreground",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-ring",
        "aria-invalid:ring-destructive aria-invalid:focus-visible:outline-destructive",
        "disabled:cursor-not-allowed disabled:bg-accent disabled:opacity-50",
        "*:data-[slot=select-value]:truncate [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      {/* The chevron sits inside Icon's span rather than replacing it with
          `asChild`: the shadcn CLI rewrites `asChild` to Base UI's `render`
          when installing into a Base UI project, which Radix does not accept.
          `flex` keeps the span from adding line-height around the svg. */}
      <SelectPrimitive.Icon className="flex text-muted-foreground">
        <ChevronDownIcon aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Same overlay surface and motion as Popover and DropdownMenu, kept as a copy
// so this registry item installs on its own; a test keeps them in sync.
const overlaySurface = cn(
  "z-50 rounded-[0.75rem] bg-popover text-popover-foreground shadow-(--shadow-overlay) ring ring-border outline-hidden",
  "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-96 motion-safe:data-[state=open]:duration-150 motion-safe:data-[state=open]:ease-out",
  "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:duration-100 motion-safe:data-[state=closed]:ease-out",
);

// Popper positioning (below the trigger, like DropdownMenu) rather than
// Radix's item-aligned default, which lays the list over the trigger so the
// chosen item sits on top of it: native-feeling on desktop, but it can open
// upward and jump on phones. At least as wide as the trigger, and scrolls
// inside the space Radix reports as available.
//
// data-nav records keyboard vs pointer for the item focus ring, as in
// DropdownMenuContent (Radix focuses items on hover too, so :focus-visible
// can't tell them apart).
function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  onKeyDown,
  onPointerMove,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={position === "popper" ? sideOffset : undefined}
        onKeyDown={(event) => {
          event.currentTarget.dataset.nav = "keyboard";
          onKeyDown?.(event);
        }}
        onPointerMove={(event) => {
          event.currentTarget.dataset.nav = "pointer";
          onPointerMove?.(event);
        }}
        className={cn(
          overlaySurface,
          "group/select relative max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// Same 12px check as Checkbox and DropdownMenu.
function CheckMark() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3"
    >
      <path d="M2.75 6.25 5 8.5 9.25 3.75" />
    </svg>
  );
}

// Like a DropdownMenu item, except the check sits at the end: item text then
// starts at 12px from the list's edge (4px padding + 8px), the same as the
// value inside the trigger, so the eye doesn't jump when the list opens.
function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex h-8 w-full cursor-default items-center gap-2 rounded-md ps-2 pe-8 text-sm text-foreground outline-hidden select-none",
        "data-highlighted:bg-accent forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText]",
        "data-highlighted:outline-2 data-highlighted:outline-solid data-highlighted:-outline-offset-2 data-highlighted:outline-ring group-data-[nav=pointer]/select:data-highlighted:outline-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckMark />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-(--hairline)", className)}
      {...props}
    />
  );
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };
