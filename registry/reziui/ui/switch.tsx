"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const motion = "motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";

// The off track uses --control-off rather than --input: the track is the only
// thing that identifies the control, so it must clear 3:1 against the page and
// against the white thumb (WCAG 1.4.11). The on track reads --btn-primary, not
// --primary, for the same reason as Button: a consumer's existing --primary
// survives a registry install and may not be the Rezi UI blue.
//
// The thumb slides 16px between the ends of the track. While pressed it
// stretches from 16px to 20px toward its direction of travel, so on the "on"
// side it also starts 4px earlier to keep its trailing edge pinned — the press
// previews where the thumb is about to go.
//
// It is placed with inset-inline-start rather than translateX: the logical
// inset follows the element's computed direction, whereas a physical translate
// needs an rtl: variant, and Tailwind's rtl: matches any [dir=rtl] ancestor —
// inside a dir="ltr" island on an RTL page that pushes the thumb off the
// track. Animating the inset costs a layout per frame, negligible for a 16px
// element. Interruptible CSS transitions (not keyframes), so rapid toggling
// never queues up animations; under reduced motion the thumb jumps.
//
// The track is 20px tall; the ::after extends the hit area to 24px (WCAG 2.5.8)
// without changing the visible size.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group/switch peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-(--control-off) outline-hidden",
        "data-[state=checked]:bg-(--btn-primary)",
        "motion-safe:transition-[background-color]",
        motion,
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "after:absolute after:inset-x-0 after:-inset-y-0.5",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none absolute start-0.5 top-0.5 block h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_0_rgb(0_0_0/0.15)]",
          "motion-safe:transition-[inset-inline-start,width]",
          motion,
          "data-[state=checked]:start-4.5",
          "group-enabled/switch:group-active/switch:w-5",
          "group-enabled/switch:group-active/switch:data-[state=checked]:start-3.5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
