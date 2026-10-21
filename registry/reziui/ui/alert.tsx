"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Grid layout: [icon] [title / description] [action]. The icon column only
// exists when an svg is the first child, and the action column only when an
// AlertAction is present, so an alert without either has no empty gutters.
// An AlertDismiss sits in the top-end corner instead of a column, and the
// alert reserves end padding for it.
//
// The icon is nudged down 2px (translate-y-0.5) so its 16px box centres on the
// 20px first line of the title rather than on the whole text block.
//
// data-state="closed" (set by AlertDismiss) plays a short exit: fade plus a
// 4px lift, ease-out, then the consumer unmounts the alert.
const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-[0.75rem] px-3.5 py-3 text-sm ring ring-inset",
    "has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-2.5",
    "has-[>[data-slot=alert-action]]:grid-cols-[0_1fr_auto] has-[>svg]:has-[>[data-slot=alert-action]]:grid-cols-[1rem_1fr_auto]",
    "has-[>[data-slot=alert-dismiss]]:pe-10",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5",
    "transition-[opacity,translate] duration-150 ease-out data-[state=closed]:pointer-events-none data-[state=closed]:-translate-y-1 data-[state=closed]:opacity-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-card ring-border [&>svg]:text-foreground",
        info: "bg-(--info-tint) ring-(--info-ring) [&>svg]:text-(--info-text) *:data-[slot=alert-title]:text-(--info-text)",
        success:
          "bg-(--success-tint) ring-(--success-ring) [&>svg]:text-(--success-text) *:data-[slot=alert-title]:text-(--success-text)",
        warning:
          "bg-(--warning-tint) ring-(--warning-ring) [&>svg]:text-(--warning-text) *:data-[slot=alert-title]:text-(--warning-text)",
        destructive:
          "bg-(--destructive-tint) ring-(--destructive-ring) [&>svg]:text-(--destructive-text) *:data-[slot=alert-title]:text-(--destructive-text)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * No live-region role by default: `role="alert"` makes screen readers
 * interrupt immediately, which is right for an error inserted after an action
 * but wrong for a tip that is part of the page. Pass `role="alert"` for
 * dynamically shown errors and `role="status"` for non-urgent updates.
 */
function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? "default"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 text-sm leading-5 font-medium text-foreground", className)}
      {...props}
    />
  );
}

// Body copy stays in the foreground color on every variant: tinted text at
// paragraph length is harder to read than the status-colored title above it.
function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-[13px] leading-normal text-foreground", className)}
      {...props}
    />
  );
}

/** Trailing slot for a button or link, vertically centred across the text. */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("col-start-3 row-span-2 row-start-1 ms-2 self-center", className)}
      {...props}
    />
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// When the dismiss button unmounts with its alert, focus would fall back to
// <body> and a keyboard user would lose their place. Hand it to the next
// focusable element after the alert, or the previous one at the end of the page.
//
// Candidates must be visible: a hidden element (an inactive tab panel keeps
// tabindex="0") silently refuses focus, which would drop focus on <body>.
// checkVisibility() is missing in some environments, so treat it as visible there.
function isFocusTarget(el: HTMLElement) {
  return !el.closest("[inert]") && (el.checkVisibility?.() ?? true);
}

function moveFocusPast(alert: HTMLElement) {
  const all = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !alert.contains(el) && isFocusTarget(el),
  );
  const next = all.find((el) => alert.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  const previous = all.findLast((el) => alert.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
  (next ?? previous)?.focus();
}

type AlertDismissProps = Omit<React.ComponentProps<"button">, "onClick" | "children"> & {
  /** Called once the exit animation has finished; unmount the alert here. */
  onDismiss: () => void;
  /** Accessible name of the button. */
  label?: string;
};

// Exit runs on a transition; the fallback timer makes sure onDismiss still
// fires if the transition never starts (reduced motion, display changes).
const EXIT_FALLBACK_MS = 250;

/**
 * Opt-in close button. Use it for tips and announcements; leave it off alerts
 * that tell the user how to recover from an error, so that guidance can't be
 * dismissed before it is acted on.
 */
function AlertDismiss({ className, onDismiss, label = "Dismiss", ...props }: AlertDismissProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const alert = event.currentTarget.closest<HTMLElement>('[data-slot="alert"]');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      if (alert) moveFocusPast(alert);
      onDismiss();
    };

    if (!alert || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    alert.dataset.state = "closed";
    alert.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, EXIT_FALLBACK_MS);
  }

  return (
    <button
      type="button"
      data-slot="alert-dismiss"
      aria-label={label}
      onClick={handleClick}
      className={cn(
        "absolute end-2.5 top-2.5 flex size-6 cursor-pointer items-center justify-center rounded-full text-current opacity-70 outline-hidden transition-[opacity,background-color]",
        "hover:bg-foreground/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      <XIcon className="size-3.5" aria-hidden="true" />
    </button>
  );
}

export { Alert, AlertAction, AlertDescription, AlertDismiss, AlertTitle, alertVariants };
