import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Emphasis variants paint the gradient straight onto the button rather than an
// overlay span, so `asChild` keeps working with a single child. Their custom
// colors are read with `from-(--var)` syntax instead of theme utilities, so the
// classes still resolve when a consumer's @theme lacks a --color-* mapping.
//
// They read only btn-* / *-hover tokens and hardcode white text, never the
// shared --primary / --primary-foreground: when the theme arrives as a
// registry dependency the shadcn CLI only adds missing variables and keeps the
// consumer's existing --primary (black by default), which would break the
// hover gradient and label contrast.
const emphasis = {
  default:
    "bg-linear-to-b from-(--btn-primary-from) to-(--btn-primary-to) text-white ring ring-(--btn-primary-ring) shadow-[inset_0_1px_0_0_var(--btn-primary-highlight),0_1px_2px_0_rgb(0_0_0/0.05)] not-disabled:hover:from-(--btn-primary) not-disabled:hover:to-(--primary-hover) focus-visible:ring-(--btn-primary-ring) disabled:opacity-50",
  destructive:
    "bg-linear-to-b from-(--btn-destructive-from) to-(--btn-destructive-to) text-white ring ring-(--btn-destructive-ring) shadow-[inset_0_1px_0_0_var(--btn-destructive-highlight),0_1px_2px_0_rgb(0_0_0/0.05)] not-disabled:hover:from-(--btn-destructive) not-disabled:hover:to-(--destructive-hover) focus-visible:ring-(--btn-destructive-ring) disabled:opacity-50",
};

// Hover styles are gated with `not-disabled:` rather than `enabled:` because
// `:enabled` never matches an <a> rendered through `asChild`.
const buttonVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap select-none",
    "transition-[color,background-color,box-shadow,opacity] outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: emphasis.default,
        secondary:
          "bg-secondary text-secondary-foreground ring ring-border shadow-xs not-disabled:hover:bg-accent disabled:bg-secondary/50 disabled:text-secondary-foreground/70",
        outline:
          "bg-transparent text-foreground ring ring-border shadow-xs not-disabled:hover:ring-foreground/25 disabled:text-muted-foreground",
        ghost: "text-foreground not-disabled:hover:bg-accent disabled:text-muted-foreground",
        destructive: emphasis.destructive,
        "destructive-secondary":
          "bg-secondary text-(--destructive-text) ring ring-border shadow-xs not-disabled:hover:ring-destructive/30 disabled:bg-secondary/50 disabled:opacity-70",
        link: "text-(--link) underline-offset-4 not-disabled:hover:underline disabled:text-muted-foreground",
      },
      // Bottom padding lifts the label: lowercase glyphs sit below the line
      // box's center, so equal top/bottom padding reads as text sagging.
      // The side holding a leading icon gets 2px less padding because icon
      // glyphs carry built-in whitespace inside their viewBox.
      size: {
        xs: "h-5 gap-1 px-2 pb-px text-xs has-[>svg:first-child]:pl-1.5",
        sm: "h-6.5 gap-1 px-2.5 pb-px text-xs has-[>svg:first-child]:pl-2",
        default: "h-9 gap-1.5 px-4 pb-0.5 text-sm has-[>svg:first-child]:pl-3.5",
        lg: "h-10 gap-2 px-5 pb-0.5 text-sm has-[>svg:first-child]:pl-4.5",
        "icon-xs": "size-5 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-6.5 [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-9",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /**
     * Shows a spinner and disables the button. Ignored visually with
     * `asChild`: Slot requires exactly one child, so no spinner is injected —
     * only `aria-busy` and `data-loading` are set.
     */
    loading?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && !asChild ? (
        <>
          <Loader2Icon className="animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
