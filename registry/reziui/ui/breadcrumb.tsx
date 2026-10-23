import * as React from "react";
import { ChevronRightIcon, EllipsisIcon } from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// A <nav> landmark named "Breadcrumb" holding an ordered list, so a screen
// reader announces both the landmark and how deep the page sits.
function Breadcrumb({ "aria-label": ariaLabel = "Breadcrumb", ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label={ariaLabel} {...props} />;
}

// 13px muted text, items 6px apart; wraps rather than overflowing on narrow
// screens, since a clipped trail hides exactly the levels people came for.
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-1.5 text-[13px] break-words text-muted-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

// Links darken to the foreground colour on hover instead of underlining: the
// whole trail is links, and a row of underlines would be noisy. The invisible
// ::after grows the 20px-tall text to a 24px hit area (WCAG 2.5.8), and focus
// gets the same offset outline as Button.
function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "relative rounded-sm outline-hidden transition-colors hover:text-foreground",
        "after:absolute after:-inset-y-0.5 after:inset-x-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

// The current page: plain text, not a link to itself, marked as the current
// location for assistive technology.
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}

// The chevron mirrors in right-to-left layouts, where the trail reads the
// other way. Hidden from assistive technology: the list already conveys order.
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5 rtl:[&>svg]:-scale-x-100", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

/**
 * Stands in for the hidden middle of a long trail. It is only a visual: wrap
 * it in a DropdownMenuTrigger (asChild on the trigger) to list the hidden
 * levels; the sr-only text names it as "More".
 */
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      className={cn("flex size-5 items-center justify-center", className)}
      {...props}
    >
      <EllipsisIcon className="size-4" aria-hidden="true" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
