"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// Small UI text uses arbitrary pixel sizes (text-[13px]) rather than named
// theme steps: tailwind-merge, behind cn(), cannot tell a custom `text-caption`
// from a text color and drops it when a color class follows.
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1.5 text-[13px] leading-5 font-medium text-foreground select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
