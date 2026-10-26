"use client";

import * as React from "react";
import { CircleCheckIcon, CircleXIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { toast as sonnerToast, Toaster as Sonner, type ExternalToast, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

// Built on Sonner, which owns the stacking, swiping, timers and the polite live
// region. Sonner injects its CSS outside any cascade layer, so it beats
// Tailwind's layered utilities on every property it sets: these classes only
// style what Sonner leaves alone in unstyled mode (surface, spacing, type,
// colour), never position, transform or transition. The enter and exit motion
// is Sonner's own 400ms, which it already switches off under reduced motion.
//
// The surface is the overlay one shared with Popover and the menus. The type
// shows only in the icon colour, so a stack of toasts stays calm.
const classNames = {
  toast: cn(
    "group/toast flex w-full items-start gap-2.5 rounded-[0.75rem] bg-popover py-3 ps-3.5 pe-10 text-popover-foreground shadow-(--shadow-overlay) ring ring-border",
    "[&_[data-icon]>svg]:size-4 [&_[data-icon]]:mt-0.5 [&_[data-icon]]:shrink-0",
    "data-[type=success]:[&_[data-icon]]:text-(--success-text) data-[type=error]:[&_[data-icon]]:text-(--destructive-text)",
    "data-[type=warning]:[&_[data-icon]]:text-(--warning-text) data-[type=info]:[&_[data-icon]]:text-(--info-text)",
    "data-[type=loading]:[&_[data-icon]]:text-muted-foreground",
  ),
  content: "flex min-w-0 flex-1 flex-col gap-0.5",
  title: "text-sm leading-5 font-medium text-foreground",
  description: "text-[13px] leading-5 text-muted-foreground",
  // The action and cancel buttons match Button's secondary variant at a 28px height.
  actionButton:
    "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-full bg-card px-2.5 text-[13px] font-medium text-foreground shadow-xs ring ring-border outline-hidden hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring",
  cancelButton:
    "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-full px-2.5 text-[13px] font-medium text-muted-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring",
  // Same corner button as Dialog and Sheet.
  closeButton:
    "absolute end-3 top-3 flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring [&>svg]:size-3.5",
};

const icons = {
  success: <CircleCheckIcon aria-hidden="true" />,
  error: <CircleXIcon aria-hidden="true" />,
  warning: <TriangleAlertIcon aria-hidden="true" />,
  info: <InfoIcon aria-hidden="true" />,
  // The spinner turns only when motion is allowed; the icon alone still says "working".
  loading: <LoaderCircleIcon aria-hidden="true" className="motion-safe:animate-spin" />,
  close: <XIcon aria-hidden="true" />,
};

/**
 * Renders the toasts. Place it once, near the root. Defaults to the top centre;
 * pass `offset` to clear a sticky header (these docs use 72px for a 60px one).
 */
function Toaster({ position = "top-center", toastOptions, style, ...props }: ToasterProps) {
  return (
    <Sonner
      position={position}
      closeButton
      icons={icons}
      // Sonner's unlayered CSS on the list sets a system font stack and its own
      // --success-text, --warning-text and --info-text, which share names with
      // the theme tokens and would shadow them inside the toasts. Inline style
      // is the only thing that beats that CSS: `inherit` hands the page's font
      // and token values back down, in both themes.
      style={
        {
          fontFamily: "inherit",
          "--success-text": "inherit",
          "--warning-text": "inherit",
          "--info-text": "inherit",
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: { ...classNames, ...toastOptions?.classNames },
      }}
      {...props}
    />
  );
}

// A toast with an action, or an error, stays until it is closed: a 4s timer
// would take away the message someone needs to act on (WCAG 2.2.1). Plain
// toasts keep Sonner's 4s, which pauses on hover and while the tab is hidden.
// An explicit `duration` always wins.
const persistent = (data?: ExternalToast): ExternalToast | undefined =>
  data?.action ? { duration: Infinity, ...data } : data;

type Toast = typeof sonnerToast;

const toast: Toast = Object.assign(
  (message: Parameters<Toast>[0], data?: ExternalToast) => sonnerToast(message, persistent(data)),
  {
    ...sonnerToast,
    message: (message: Parameters<Toast["message"]>[0], data?: ExternalToast) =>
      sonnerToast.message(message, persistent(data)),
    success: (message: Parameters<Toast["success"]>[0], data?: ExternalToast) =>
      sonnerToast.success(message, persistent(data)),
    info: (message: Parameters<Toast["info"]>[0], data?: ExternalToast) => sonnerToast.info(message, persistent(data)),
    warning: (message: Parameters<Toast["warning"]>[0], data?: ExternalToast) =>
      sonnerToast.warning(message, persistent(data)),
    error: (message: Parameters<Toast["error"]>[0], data?: ExternalToast) =>
      sonnerToast.error(message, { duration: Infinity, ...data }),
  },
);

export { toast, Toaster };
