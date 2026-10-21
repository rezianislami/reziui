import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Badges are rounded rectangles on purpose: every pill-shaped element in ziUI
// is a Button, so a pill badge would read as clickable. rounded-sm follows the
// consumer's --radius (6px at the default 0.625rem) instead of a fixed value.
//
// Hover styles are scoped with `[a&]:` so they only apply when the badge is
// rendered as a link through `asChild`; a static badge never reacts to the pointer.
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center rounded-sm font-medium whitespace-nowrap select-none",
    "transition-[color,background-color,box-shadow,opacity] outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-[11px]",
  ],
  {
    variants: {
      variant: {
        default: "bg-foreground text-background [a&]:hover:opacity-80",
        secondary: "bg-accent text-accent-foreground [a&]:hover:bg-foreground/10",
        outline: "text-foreground ring ring-border ring-inset [a&]:hover:bg-accent",
        success:
          "bg-(--success-tint) text-(--success-text) ring ring-(--success-ring) ring-inset [a&]:hover:ring-(--success-text)",
        warning:
          "bg-(--warning-tint) text-(--warning-text) ring ring-(--warning-ring) ring-inset [a&]:hover:ring-(--warning-text)",
        info: "bg-(--info-tint) text-(--info-text) ring ring-(--info-ring) ring-inset [a&]:hover:ring-(--info-text)",
        destructive:
          "bg-(--destructive-tint) text-(--destructive-text) ring ring-(--destructive-ring) ring-inset [a&]:hover:ring-(--destructive-text)",
      },
      // Bottom padding lifts the label optically, as in Button. A leading icon
      // or dot takes 2px off the left padding to balance its built-in whitespace.
      size: {
        sm: "h-4.5 gap-1 px-1.5 pb-px text-[11px] has-[>svg:first-child,>[data-slot=badge-dot]:first-child]:pl-1",
        default: "h-5 gap-1 px-2 pb-px text-xs has-[>svg:first-child,>[data-slot=badge-dot]:first-child]:pl-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    /** Shows a leading status dot in the badge's text color. */
    dot?: boolean;
  };

function Badge({ className, variant = "default", size = "default", asChild = false, dot = false, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {dot && <span data-slot="badge-dot" aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />}
      {/* Slottable lets the dot sit beside the asChild element instead of
          breaking Slot's single-child rule. */}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
