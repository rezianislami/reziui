import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, Loader2Icon } from "lucide-react";
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
    "bg-linear-to-b from-(--btn-primary-from) to-(--btn-primary-to) text-white ring ring-(--btn-primary-ring) shadow-[inset_0_1px_0_0_var(--btn-primary-highlight),0_1px_2px_0_rgb(0_0_0/0.05)] not-disabled:hover:from-(--btn-primary) not-disabled:hover:to-(--primary-hover) disabled:opacity-50",
  destructive:
    "bg-linear-to-b from-(--btn-destructive-from) to-(--btn-destructive-to) text-white ring ring-(--btn-destructive-ring) shadow-[inset_0_1px_0_0_var(--btn-destructive-highlight),0_1px_2px_0_rgb(0_0_0/0.05)] not-disabled:hover:from-(--btn-destructive) not-disabled:hover:to-(--destructive-hover) disabled:opacity-50",
};

// Hover styles are gated with `not-disabled:` rather than `enabled:` because
// `:enabled` never matches an <a> rendered through `asChild`.
//
// Focus is an offset outline, not a box-shadow ring: forced-colors mode
// (Windows High Contrast) strips box-shadows, which would leave keyboard users
// with no indicator, and the 2px gap keeps the ring visible against the
// button's own edge instead of merging into it. `outline-hidden` is a
// transparent outline that forced-colors mode still paints.
const buttonVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap select-none",
    "transition-[color,background-color,box-shadow,opacity,scale] outline-hidden",
    "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // Leading-icon trim (per-size value in --btn-ps-icon), for a plain icon
    // child and for the first layer of a success-capable button.
    "has-[>svg:first-child]:ps-(--btn-ps-icon) has-[>[data-slot=button-content]>[data-active]>svg:first-child]:ps-(--btn-ps-icon)",
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
      // glyphs carry built-in whitespace inside their viewBox. Padding is
      // logical (ps-*) so the icon side mirrors in right-to-left layouts.
      //
      // The 20px sizes extend their hit area to 24px with an invisible ::after
      // (WCAG 2.5.8 minimum target) without growing the visible button.
      size: {
        xs: "relative h-5 gap-1 px-2 pb-px text-xs after:absolute after:-inset-0.5 [--btn-ps-icon:--spacing(1.5)] [--btn-px-icon:--spacing(1)] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-6.5 gap-1 px-2.5 pb-px text-xs [--btn-ps-icon:--spacing(2)] [--btn-px-icon:--spacing(1.5)] [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 gap-1.5 px-4 pb-0.5 text-sm [--btn-ps-icon:--spacing(3.5)] [--btn-px-icon:--spacing(2.5)]",
        lg: "h-10 gap-2 px-5 pb-0.5 text-sm [--btn-ps-icon:--spacing(4.5)] [--btn-px-icon:--spacing(3)]",
        "icon-xs": "relative size-5 after:absolute after:-inset-0.5 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-6.5 [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-9",
        "icon-lg": "size-10",
      },
      // Press feedback: scale(0.96) on :active, only when motion is allowed.
      // `static` turns it off where movement would distract (dense toolbars,
      // buttons inside moving surfaces).
      static: {
        false: "motion-safe:not-disabled:active:scale-[0.96]",
        true: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      static: false,
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  Omit<VariantProps<typeof buttonVariants>, "static"> & {
    asChild?: boolean;
    /** Disables the press-scale feedback. */
    static?: boolean;
    /**
     * Shows a spinner and disables the button. Ignored visually with
     * `asChild`: Slot requires exactly one child, so no spinner is injected —
     * only `aria-busy` and `data-loading` are set.
     */
    loading?: boolean;
    /**
     * Controlled success state for async actions: while true, the label
     * cross-fades to a check and `successLabel`. Pass it (true or false) only on
     * buttons that use it — that is what switches on the layered markup.
     * Reset it yourself, e.g. after ~2s.
     */
    success?: boolean;
    /** Text shown (and announced) in the success state. */
    successLabel?: React.ReactNode;
  };

// Morph for success-capable buttons: the button hugs whichever layer is
// active (label → spinner → check + success label) and animates between those
// widths. The active layer sits in the normal flow, so the width is right even
// before hydration; the others are stacked absolutely in the centre. After
// mount each layer's natural width is measured and set on the wrapper, which
// is what lets the width transition (CSS can't transition to `auto`).
// Under reduced motion every change is instant.
const morphMotion = "motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";
const layerMotion = cn("motion-safe:transition-[opacity,translate,filter]", morphMotion);

type Layer = "idle" | "loading" | "success";

function SuccessLayers({
  loading,
  success,
  successLabel,
  children,
}: {
  loading: boolean;
  success: boolean;
  successLabel: React.ReactNode;
  children: React.ReactNode;
}) {
  const idleRef = React.useRef<HTMLSpanElement>(null);
  const loadingRef = React.useRef<HTMLSpanElement>(null);
  const successRef = React.useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = React.useState<Record<Layer, number> | null>(null);
  const active: Layer = loading ? "loading" : success ? "success" : "idle";

  React.useLayoutEffect(() => {
    const els = [idleRef.current, loadingRef.current, successRef.current];
    const measure = () => {
      const [idle, load, done] = els.map((el) => el?.offsetWidth ?? 0);
      // No layout (tests, hidden subtree): keep the natural in-flow width.
      if (!idle) return;
      setWidths({ idle, loading: load, success: done });
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    els.forEach((el) => el && observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  const layer = (name: Layer) =>
    cn(
      "inline-flex w-max items-center justify-center gap-[inherit]",
      layerMotion,
      name !== active && "pointer-events-none absolute inset-0 m-auto h-max opacity-0 blur-[2px]",
      name !== active &&
        (name === "success" || (name === "loading" && active === "idle") ? "translate-y-0.5" : "-translate-y-0.5"),
    );

  return (
    <span
      data-slot="button-content"
      className={cn(
        "relative flex items-center justify-center gap-[inherit] motion-safe:transition-[width]",
        morphMotion,
      )}
      style={widths ? { width: widths[active] } : undefined}
    >
      {/* While loading the label is only hidden visually, so the button keeps
          its name (with aria-busy); on success it leaves the a11y tree. */}
      <span
        ref={idleRef}
        data-layer="idle"
        data-active={active === "idle" || undefined}
        aria-hidden={success || undefined}
        className={layer("idle")}
      >
        {children}
      </span>
      <span
        ref={loadingRef}
        data-layer="loading"
        data-active={active === "loading" || undefined}
        aria-hidden="true"
        className={layer("loading")}
      >
        <Loader2Icon className="motion-safe:animate-spin" />
      </span>
      <span
        ref={successRef}
        data-layer="success"
        data-active={active === "success" || undefined}
        className={layer("success")}
      >
        <CheckIcon aria-hidden="true" />
        <span aria-hidden="true">{successLabel}</span>
        {/* Gets text only on success: that is what the polite live region
            announces and what names the button then. */}
        <span className="sr-only" aria-live="polite">
          {success ? successLabel : ""}
        </span>
      </span>
    </span>
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  static: isStatic = false,
  success,
  successLabel = "Saved",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  // Success-capable buttons render loading as a layer too, so idle → spinner →
  // success is one continuous morph. While loading the button becomes an
  // icon-only circle: padding swaps to (height − icon) / 2 per size.
  const layered = success !== undefined && !asChild;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-success={(layered && success) || undefined}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled || loading}
      data-morph={layered || undefined}
      className={cn(
        buttonVariants({ variant, size, static: isStatic }),
        layered && [
          "motion-safe:transition-[color,background-color,box-shadow,opacity,scale,padding]",
          morphMotion,
          "data-loading:pb-0 data-loading:px-(--btn-px-icon)!",
        ],
        className,
      )}
      {...props}
    >
      {loading && !asChild && !layered ? (
        <>
          {/* Spins only when motion is allowed; aria-busy and the label still
              carry the loading state when it stays still. */}
          <Loader2Icon className="motion-safe:animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : layered ? (
        <SuccessLayers loading={loading} success={success} successLabel={successLabel}>
          {children}
        </SuccessLayers>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
