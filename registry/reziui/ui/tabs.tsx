"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-3", className)} {...props} />;
}

type Indicator = { x: number; width: number };

// The list is a pill track. The active tab is raised onto it with the card
// surface, ring and shadow — the same treatment as a secondary Button.
//
// That raised pill is one shared indicator element which slides and resizes
// to the active trigger (200ms, interruptible CSS transition), instead of each
// trigger painting its own background. Until the indicator has been measured
// (server render, before hydration) the active trigger paints the pill itself,
// so there is never a frame without a selected state. Under
// prefers-reduced-motion the indicator still moves, just without transitioning.
//
// Positions come from offsetLeft/offsetWidth, which are physical (left-based)
// in both writing directions, so the physical `left-0` + translateX is correct
// in RTL too.
function TabsList({ className, children, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = React.useState<Indicator | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]');
      setIndicator(active ? { x: active.offsetLeft, width: active.offsetWidth } : null);
    };
    measure();

    // Radix flips data-state on the triggers; labels can also change width
    // (fonts loading, translations), so watch both.
    const mutations = new MutationObserver(measure);
    mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
    const resizes = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resizes?.observe(list);
    list.querySelectorAll('[data-slot="tabs-trigger"]').forEach((trigger) => resizes?.observe(trigger));

    return () => {
      mutations.disconnect();
      resizes?.disconnect();
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={setRefs}
      data-slot="tabs-list"
      data-indicator={indicator ? "ready" : undefined}
      className={cn("group/tabs-list relative inline-flex w-fit items-center gap-0.5 rounded-full bg-accent p-[3px]", className)}
      {...props}
    >
      {indicator && (
        <span
          aria-hidden="true"
          data-slot="tabs-indicator"
          style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
          className="pointer-events-none absolute inset-y-[3px] left-0 rounded-full bg-card shadow-xs ring ring-border motion-safe:transition-[transform,width] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]"
        />
      )}
      {children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 pb-px text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] outline-hidden",
        "not-disabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        // Self-painted pill until the shared indicator is measured; the more
        // specific group-data selector then hands the pill to the indicator.
        "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:ring data-[state=active]:ring-border",
        "group-data-[indicator=ready]/tabs-list:data-[state=active]:bg-transparent group-data-[indicator=ready]/tabs-list:data-[state=active]:shadow-none group-data-[indicator=ready]/tabs-list:data-[state=active]:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

// The panel fades in over 150ms when it becomes active — short enough for a
// high-frequency switch, and skipped entirely under prefers-reduced-motion.
// It uses @starting-style (`starting:`) rather than a keyframe: Radix mounts
// the active panel fresh on every switch, so a transition from opacity 0 runs
// on its own, and consumers need no extra @keyframes in their CSS.
// Radix makes the panel focusable (Tab moves into it), so it gets the same
// offset outline as the triggers.
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "transition-opacity duration-150 ease-[cubic-bezier(0.2,0,0,1)] motion-safe:starting:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
