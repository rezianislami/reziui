"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

// Same overlay surface and motion as PopoverContent. Kept as a copy rather
// than imported so this registry item installs on its own; a test keeps the
// two in sync.
const overlaySurface = cn(
  "z-50 rounded-[0.75rem] bg-popover text-popover-foreground shadow-(--shadow-overlay) ring ring-border outline-hidden",
  "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-96 motion-safe:data-[state=open]:duration-150 motion-safe:data-[state=open]:ease-out",
  "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:duration-100 motion-safe:data-[state=closed]:ease-out",
);

// 4px padding with radius 12 around radius-8 items keeps the corners
// concentric. The content scrolls inside the space Radix reports as available
// instead of running off-screen in a short viewport.
//
// data-nav records whether the menu was last driven by keyboard or pointer,
// for the item focus ring. Written straight to the DOM so pointer moves don't
// re-render the menu. Until either happens it is unset, which counts as
// keyboard: a menu opened from the keyboard highlights its first item at once,
// while one opened by pointer highlights nothing until the pointer moves.
function DropdownMenuContent({
  className,
  sideOffset = 6,
  onKeyDown,
  onPointerMove,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
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
          "group/menu max-h-(--radix-dropdown-menu-content-available-height) min-w-52 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto p-1",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

// The highlight (pointer hover or keyboard focus) switches instantly: it fires
// on every pointer move, so a transition would only add lag. The accent fill
// is under 3:1 against the menu — fine as hover feedback, too faint to follow
// with the keyboard — so the highlighted item also gets an inset 2px ring
// unless the menu is being driven by the pointer (data-nav, set by
// DropdownMenuContent). Not :focus-visible: Radix focuses items on hover too,
// and Chrome matches :focus-visible for that. Forced-colors mode drops
// background colors, so it paints the system Highlight pair there instead.
//
// Every item starts its text at 32px: an icon takes 16px plus the 8px gap,
// and checkbox/radio items reserve the same space (ps-8) for their indicator,
// so mixed menus line up.
const itemBase = cn(
  "relative flex h-8 cursor-default items-center gap-2 rounded-md px-2 text-sm text-foreground outline-hidden select-none",
  "data-highlighted:bg-accent forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText]",
  "data-highlighted:outline-2 data-highlighted:outline-solid data-highlighted:-outline-offset-2 data-highlighted:outline-ring group-data-[nav=pointer]/menu:data-highlighted:outline-none",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        itemBase,
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "data-[variant=destructive]:text-(--destructive-text) data-[variant=destructive]:[&_svg:not([class*='text-'])]:text-(--destructive-text)",
        className,
      )}
      {...props}
    />
  );
}

// Same 12px check as Checkbox, drawn in the item's text color.
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

const indicator = "pointer-events-none absolute start-2 flex size-4 items-center justify-center";

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemBase, "ps-8", className)}
      {...props}
    >
      <span className={indicator}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckMark />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(itemBase, "ps-8", className)}
      {...props}
    >
      <span className={indicator}>
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="block size-1.5 rounded-full bg-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/** Non-interactive heading for a group of items. */
function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

// Inset by the content's 4px padding on both sides, in line with the items.
function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-(--hairline)", className)}
      {...props}
    />
  );
}

/** Trailing keyboard hint. Visual only — bind the shortcut yourself. */
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
};
