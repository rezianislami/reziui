"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

// Same scrim as Dialog.
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40",
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:duration-250",
        "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:duration-200",
        className,
      )}
      {...props}
    />
  );
}

// Sides are logical: "start" is the left edge in left-to-right layouts and the
// right edge in right-to-left ones. Placement uses inset-inline-start/end,
// which always follows the computed direction. The slide uses tw-animate-css's
// slide-*-start/end, written with :dir(); Lightning CSS (Tailwind v4's build)
// lowers :dir() to a :lang() list of right-to-left languages for older
// browsers, so the slide direction follows the page's `lang`, not `dir`. The
// sheet is portalled to <body>, so that is the document's language — correct
// on any RTL page that declares its language, as it should.
const sides = {
  start:
    "inset-y-0 start-0 border-e motion-safe:data-[state=open]:slide-in-from-start motion-safe:data-[state=closed]:slide-out-to-start",
  end: "inset-y-0 end-0 border-s motion-safe:data-[state=open]:slide-in-from-end motion-safe:data-[state=closed]:slide-out-to-end",
};

// The overlay surface (--popover, --shadow-overlay) attached to a screen edge:
// a 1px border on the inner edge only, and no radius where it meets the edge.
// Laid out like Dialog — header, scrolling body, footer — with the × in the
// top-end corner. Slides in over 250ms and out in 200ms: a longer travel than
// Dialog's scale, so slightly longer, still decelerating (ease-out family).
// Skipped under reduced motion.
function SheetContent({
  className,
  children,
  side = "end",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: keyof typeof sides;
  /** The × in the top-end corner. */
  showCloseButton?: boolean;
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        data-close={showCloseButton || undefined}
        className={cn(
          "group/sheet fixed z-50 flex h-dvh w-80 max-w-[85vw] flex-col border-(--border) bg-popover text-popover-foreground shadow-(--shadow-overlay) outline-hidden",
          "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:duration-250 motion-safe:data-[state=open]:ease-[cubic-bezier(0.2,0,0,1)]",
          "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:duration-200 motion-safe:data-[state=closed]:ease-out",
          sides[side],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            aria-label="Close"
            className={cn(
              "absolute end-3 top-3 flex size-6.5 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-hidden transition-colors",
              "hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <XIcon className="size-3.5" aria-hidden="true" />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

// Same as DialogHeader: the end padding clears the × when it is shown.
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1 px-5 pt-5 group-data-close/sheet:pe-12", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base leading-snug font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-[13px] leading-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Fills the space between header and footer and scrolls on its own. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto p-5", className)} {...props} />;
}

// Same footer as Dialog and Card, pinned to the bottom of the panel.
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex items-center justify-end gap-2 border-t border-(--hairline) bg-(--surface-elevated) px-5 py-3.5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
};
