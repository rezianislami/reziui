"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// The edge uses --control-off, not --input: for an unchecked box that 1px edge
// is the only thing identifying the control, so it must clear 3:1 against the
// page (WCAG 1.4.11). Checked and indeterminate fill with --btn-primary rather
// than --primary, which a consumer's theme may already define as another color.
//
// The 16px box extends its hit area to 24px with an invisible ::after
// (WCAG 2.5.8); wrap it in a <Label> to make the text clickable as well.
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[0.25rem] border border-(--control-off) bg-card text-white shadow-xs outline-hidden",
        "motion-safe:transition-[background-color,border-color] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
        "data-[state=checked]:border-(--btn-primary) data-[state=checked]:bg-(--btn-primary)",
        "data-[state=indeterminate]:border-(--btn-primary) data-[state=indeterminate]:bg-(--btn-primary)",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "after:absolute after:-inset-1",
        className,
      )}
      {...props}
    >
      <CheckboxIndicator />
    </CheckboxPrimitive.Root>
  );
}

// Both marks are always mounted (forceMount) so they can animate out as well
// as in. Each path has pathLength=1, so a dash offset of 1 hides the stroke and
// 0 draws it: checking draws the mark in over 200ms, unchecking erases it in
// 100ms (exits are softer than entrances). The opacity transition hides the
// round cap that a zero-length dash would otherwise leave behind. Under reduced
// motion the mark appears and disappears at once.
const mark = cn(
  "[stroke-dasharray:1] [stroke-dashoffset:1] opacity-0",
  "motion-safe:transition-[stroke-dashoffset,opacity] motion-safe:duration-100 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
);

function CheckboxIndicator() {
  return (
    <CheckboxPrimitive.Indicator forceMount data-slot="checkbox-indicator" className="pointer-events-none flex">
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-3"
      >
        <path
          data-mark="check"
          d="M2.75 6.25 5 8.5 9.25 3.75"
          pathLength={1}
          className={cn(
            mark,
            "group-data-[state=checked]/checkbox:[stroke-dashoffset:0] group-data-[state=checked]/checkbox:opacity-100 motion-safe:group-data-[state=checked]/checkbox:duration-200",
          )}
        />
        <path
          data-mark="indeterminate"
          d="M3 6h6"
          pathLength={1}
          className={cn(
            mark,
            "group-data-[state=indeterminate]/checkbox:[stroke-dashoffset:0] group-data-[state=indeterminate]/checkbox:opacity-100 motion-safe:group-data-[state=indeterminate]/checkbox:duration-200",
          )}
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  );
}

export { Checkbox };
