"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

// Built like Checkbox: the 1px --control-off edge is the only thing that
// identifies an unselected radio, so it clears 3:1 against the page (WCAG
// 1.4.11); the selected one fills with --btn-primary rather than --primary,
// which a consumer's theme may define as another color. The 16px circle has a
// 24px hit area; pair it with a <Label> to make the text clickable too.
//
// The dot is always mounted (forceMount) so it can scale in from 25% and fade
// (150ms) instead of popping in. Under reduced motion it appears at once.
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio peer relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-(--control-off) bg-card shadow-xs outline-hidden",
        "motion-safe:transition-[background-color,border-color] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
        "data-[state=checked]:border-(--btn-primary) data-[state=checked]:bg-(--btn-primary)",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "after:absolute after:-inset-1",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className={cn(
          "pointer-events-none block size-1.5 scale-25 rounded-full bg-white opacity-0",
          "motion-safe:transition-[scale,opacity] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
          "group-data-[state=checked]/radio:scale-100 group-data-[state=checked]/radio:opacity-100",
        )}
      />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
