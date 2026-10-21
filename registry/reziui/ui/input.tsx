import * as React from "react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  /** Decorative icon inside the field, before the text (e.g. a search glass). */
  startIcon?: React.ReactNode;
  /**
   * Opt-in clear button. Shown only while the field is controlled and
   * non-empty. Off by default: on ordinary form fields a one-click clear risks
   * wiping typed data with no undo and competes with password-manager and
   * validation icons on the trailing edge — use it for search and filter fields.
   */
  onClear?: () => void;
  /** Accessible name of the clear button. */
  clearLabel?: string;
};

// Rounded rect (rounded-md), not pill: in Rezi UI the pill shape is reserved
// for actions, so a pill field would read as a button.
//
// Text is 16px below the sm breakpoint because iOS Safari zooms the page into
// any focused input smaller than that; it drops to 14px from sm up.
//
// Focus is a 2px outline drawn over the field's own 1px edge (negative offset)
// rather than a box-shadow ring, so it survives forced-colors mode.
const inputClasses = cn(
  "flex h-9 w-full min-w-0 rounded-md bg-card px-3 pb-px text-base text-foreground shadow-xs ring ring-input transition-[box-shadow] outline-hidden sm:text-sm",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-ring",
  "aria-invalid:ring-destructive aria-invalid:focus-visible:outline-destructive",
  "disabled:cursor-not-allowed disabled:bg-accent disabled:opacity-50",
  "file:me-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
);

function Input({ className, startIcon, onClear, clearLabel = "Clear", ...props }: InputProps) {
  if (!startIcon && onClear === undefined) {
    return <input data-slot="input" className={cn(inputClasses, className)} {...props} />;
  }

  const canClear = onClear !== undefined && typeof props.value === "string" && props.value.length > 0 && !props.disabled;

  // Logical positions (start/end, ps/pe) so the icon and clear button swap
  // sides in right-to-left layouts.
  return (
    <div data-slot="input-group" className="relative w-full">
      {startIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute start-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
        >
          {startIcon}
        </span>
      )}
      <input
        data-slot="input"
        className={cn(
          inputClasses,
          startIcon && "ps-9",
          // With our own clear button, hide the browser's built-in one that
          // Chrome and Safari draw inside type="search" fields — otherwise two
          // × icons show up. Without onClear the native one is left alone,
          // since it is then the only way to clear the field.
          onClear !== undefined &&
            "pe-9 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
        {...props}
      />
      {onClear !== undefined && (
        // Kept in the DOM while hidden so it can animate in and out (scale,
        // opacity and blur, per the contextual-icon recipe). `inert` removes
        // the hidden button from focus and the accessibility tree in one go;
        // aria-hidden on a still-focusable button would be an a11y violation.
        <button
          type="button"
          aria-label={clearLabel}
          inert={!canClear}
          data-state={canClear ? "visible" : "hidden"}
          onClick={onClear}
          className={cn(
            "absolute end-2 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-hidden",
            "hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring",
            "motion-safe:transition-[opacity,scale,filter] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
            "data-[state=hidden]:pointer-events-none data-[state=hidden]:scale-25 data-[state=hidden]:opacity-0 data-[state=hidden]:blur-[4px]",
          )}
        >
          <XIcon className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export { Input };
export type { InputProps };
