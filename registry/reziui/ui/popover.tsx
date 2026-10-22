"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/** Positions the content against something other than the trigger. */
function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

// The overlay surface, also used by DropdownMenu: --popover fill (lifted
// above --card in dark mode), a 1px ring and --shadow-overlay. Radius 12
// matches Card, so a popover opened from a card doesn't look like a different
// family.
//
// Motion: fades and scales up from 96% toward the trigger (Radix sets the
// transform-origin), 150ms ease-out; fades out in 100ms. Keyframes from
// tw-animate-css rather than transitions, because Radix keeps the content
// mounted until an exit *animation* ends. Skipped under reduced motion.
//
// DropdownMenu keeps an identical copy instead of importing this, so each
// registry item installs on its own; a test keeps the two in sync.
const overlaySurface = cn(
  "z-50 rounded-[0.75rem] bg-popover text-popover-foreground shadow-(--shadow-overlay) ring ring-border outline-hidden",
  "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-96 motion-safe:data-[state=open]:duration-150 motion-safe:data-[state=open]:ease-out",
  "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:duration-100 motion-safe:data-[state=closed]:ease-out",
);

function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          overlaySurface,
          "w-72 origin-(--radix-popover-content-transform-origin) p-4 text-sm",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
