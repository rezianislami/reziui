"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Accessible name for each thumb, in order: ["Minimum price", "Maximum price"].
   * Without it, the slider's own aria-label / aria-labelledby names every thumb.
   */
  thumbLabels?: string[];
};

// A 4px groove (--control-track) with the selected range in --btn-primary,
// which, like Radio and Switch, stays the brand blue even if a consumer's
// theme redefines --primary. The thumb is built like Radio: a 16px circle on
// the card surface whose 1px --control-off edge clears 3:1 (WCAG 1.4.11), the
// same offset focus outline, and a 24px hit area from an invisible ::after.
//
// Nothing animates: the thumb follows the pointer or the arrow keys directly,
// and the range fill is the static cue for the value.
//
// The thumbs are named on the thumb elements because that is where Radix puts
// role="slider"; a label on the root would name a wrapper nobody focuses.
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderProps) {
  // One thumb per value. Uncontrolled sliders without a defaultValue start
  // with a single thumb at the minimum, as Radix itself does.
  const thumbs = (value ?? defaultValue ?? [min]).length;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex h-5 w-full touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-(--control-track) data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-(--btn-primary) data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          aria-label={thumbLabels?.[i] ?? ariaLabel}
          aria-labelledby={thumbLabels?.[i] ? undefined : ariaLabelledBy}
          className={cn(
            "relative block size-4 shrink-0 cursor-grab rounded-full border border-(--control-off) bg-card shadow-xs outline-hidden active:cursor-grabbing",
            "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
            "data-disabled:cursor-not-allowed",
            "after:absolute after:-inset-1 after:rounded-full",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
