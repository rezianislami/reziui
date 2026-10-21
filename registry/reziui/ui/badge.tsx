import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Badges are rounded rectangles on purpose: every pill-shaped element in Rezi UI
// is a Button, so a pill badge would read as clickable. rounded-sm follows the
// consumer's --radius (6px at the default 0.625rem) instead of a fixed value.
//
// Hover styles are scoped with `[a&]:` so they only apply when the badge is
// rendered as a link through `asChild`; a static badge never reacts to the pointer.
// A link badge also grows its hit area to 24px tall with an invisible ::after
// (WCAG 2.5.8) and gets the same offset-outline focus as Button.
//
// Every variant is a tint with a 1px inset ring — one visual family. The brand
// blue is deliberately absent: in Rezi UI it means "interactive" (Button,
// links, focus), so a blue static label would read as clickable, and it sat
// within 15° of the `info` sky hue, which made the two read as the same color.
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center rounded-sm font-medium whitespace-nowrap select-none",
    "transition-[color,background-color,box-shadow,opacity] outline-hidden",
    "[a&]:relative [a&]:after:absolute [a&]:after:-inset-y-0.5 [a&]:after:inset-x-0",
    "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-[11px]",
  ],
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground ring ring-border ring-inset [a&]:hover:ring-foreground/30",
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
      // or dot takes 2px off the start padding (logical, so it mirrors in RTL)
      // to balance its built-in whitespace.
      size: {
        sm: "h-4.5 gap-1 px-1.5 pb-px text-[11px] has-[>svg:first-child,>[data-slot=badge-dot]:first-child]:ps-1",
        default: "h-5 gap-1 px-2 pb-px text-xs has-[>svg:first-child,>[data-slot=badge-dot]:first-child]:ps-1.5",
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
    /**
     * Radiates a ring from the dot (implies `dot`). Reserve it for states that
     * are genuinely in progress — Building, Live, Syncing — so the motion
     * carries meaning; the label still states the status when motion is off.
     */
    pulse?: boolean;
  };

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      data-pulse={pulse || undefined}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {(dot || pulse) && (
        <span data-slot="badge-dot" aria-hidden="true" className="relative size-1.5 shrink-0 rounded-full bg-current">
          {/* Tailwind's built-in `ping` keyframes, so consumers need no extra
              CSS; motion-safe keeps it still under reduced motion. */}
          {pulse && <span className="absolute inset-0 rounded-full bg-current opacity-60 motion-safe:animate-ping" />}
        </span>
      )}
      {/* Slottable lets the dot sit beside the asChild element instead of
          breaking Slot's single-child rule. */}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
