"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

// Items are divided by a hairline, not boxed: an accordion is a list, and a
// box per item would make every row look like a separate card.
function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-(--hairline)", className)}
      {...props}
    />
  );
}

// The whole row is the button. Hover darkens the chevron rather than
// underlining the title: an underline reads as a link, and the row already
// shows it is clickable through the chevron and the pointer cursor.
//
// The focus ring is drawn by ::after, 4px outside the row horizontally (the
// text starts flush with the row's edge, so a ring on the button itself would
// touch it) and 4px inside vertically (an outline-offset ring would run into
// the first line of an open panel below). It is an outline, not a box-shadow
// ring, so it survives forced-colors mode.
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger relative flex flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-start text-sm font-medium text-foreground outline-hidden",
          "after:pointer-events-none after:absolute after:-inset-x-1 after:inset-y-1 after:rounded-md",
          "focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            "motion-safe:transition-[rotate,color] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
            "group-hover/trigger:text-foreground group-disabled/trigger:text-muted-foreground",
            "group-data-[state=open]/trigger:rotate-180",
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// Height animates from 0 to Radix's measured --radix-accordion-content-height:
// 200ms open, 150ms closed (exits are softer). overflow-hidden stays on the
// outer element so the padding lives on an inner one and is clipped with the
// text instead of jumping in at the end. Under reduced motion it opens at once.
function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm text-muted-foreground",
        "motion-safe:data-[state=open]:animate-accordion-down motion-safe:data-[state=open]:duration-200 motion-safe:data-[state=open]:ease-[cubic-bezier(0.2,0,0,1)]",
        "motion-safe:data-[state=closed]:animate-accordion-up motion-safe:data-[state=closed]:duration-150 motion-safe:data-[state=closed]:ease-out",
      )}
      {...props}
    >
      <div className={cn("pb-4 leading-normal text-pretty", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
