"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// 40% black in both themes: on a dark page it mostly dims the edges of the
// window, which is enough — the window itself is lifted (--popover) and ringed.
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40",
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:duration-150",
        "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:duration-100",
        className,
      )}
      {...props}
    />
  );
}

// The overlay surface shared with Popover and DropdownMenu (--popover, 1px
// ring, --shadow-overlay), at radius 16 for a larger window — written as 1rem,
// since this theme's rounded-2xl is 18px. Laid out like
// Card — header, content, footer — with no padding of its own, so the footer
// can run edge to edge. Centered with fixed + translate; on phones it keeps a
// 16px margin and scrolls inside when taller than the viewport.
//
// Motion: fades and scales in from 96% (150ms ease-out), out in 100ms; the
// scrim fades alongside. tw-animate-css keyframes, because Radix keeps the
// content mounted until an exit *animation* ends. Skipped under reduced motion.
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /**
   * The × in the top-end corner. Turn it off for confirmations, which should
   * be answered with one of their buttons.
   */
  showCloseButton?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-close={showCloseButton || undefined}
        className={cn(
          "group/dialog fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto",
          "rounded-[1rem] bg-popover text-popover-foreground shadow-(--shadow-overlay) ring ring-border outline-hidden",
          "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-96 motion-safe:data-[state=open]:duration-150 motion-safe:data-[state=open]:ease-out",
          "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-96 motion-safe:data-[state=closed]:duration-100 motion-safe:data-[state=closed]:ease-out",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label="Close"
            className={cn(
              "absolute end-3 top-3 flex size-6.5 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-hidden transition-colors",
              "hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <XIcon className="size-3.5" aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// Same spacing as CardHeader; the end padding grows to clear the × when it is
// shown, so a long title wraps before running under it.
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1 px-5 pt-5 group-data-close/dialog:pe-12", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base leading-snug font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-[13px] leading-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Body between header and footer; 20px padding like CardContent. */
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("p-5", className)} {...props} />;
}

// Same footer as Card. mt-auto pins it to the bottom; a header followed
// directly by the footer gets 20px of space from mt-5 instead.
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-auto flex items-center justify-end gap-2 border-t border-(--hairline) bg-(--surface-elevated) px-5 py-3.5",
        "[[data-slot=dialog-header]+&]:mt-5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};
