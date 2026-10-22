"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const ProviderContext = React.createContext(false);

/**
 * Shares one open/skip timer between every tooltip inside it: after one
 * tooltip has opened, moving to another trigger within `skipDelayDuration`
 * opens it instantly. Put one near the root of the app.
 */
function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 300,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <ProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />
    </ProviderContext.Provider>
  );
}

// A tooltip outside any TooltipProvider gets its own, so it still works on its
// own. Not unconditionally, as some libraries do: a provider per tooltip gives
// each one a private timer, which loses the instant hand-off between
// neighbouring triggers (toolbars, icon rows).
function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const hasProvider = React.useContext(ProviderContext);
  const root = <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
  return hasProvider ? root : <TooltipProvider>{root}</TooltipProvider>;
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

// Inverted surface (foreground on background) so the label reads as a
// transient overlay over any content, cards included. 12/16 type with 4×8
// padding makes a 24px chip; long text wraps at 240px.
//
// Motion: after the open delay it fades and scales up from 96% toward the
// trigger (transform-origin from Radix), 150ms ease-out, and fades out in
// 100ms. When it opens instantly (`instant-open`: the user is already moving
// between triggers) it skips the entrance, so scanning a toolbar doesn't
// flicker. Keyframes from tw-animate-css rather than transitions, because
// Radix keeps the content mounted until an exit *animation* ends.
function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit max-w-60 origin-(--radix-tooltip-content-transform-origin) rounded-[0.375rem] bg-foreground px-2 py-1 text-xs text-pretty text-background shadow-[0_4px_12px_0_rgb(0_0_0/0.12)]",
          "motion-safe:data-[state=delayed-open]:animate-in motion-safe:data-[state=delayed-open]:fade-in-0 motion-safe:data-[state=delayed-open]:zoom-in-96 motion-safe:data-[state=delayed-open]:duration-150 motion-safe:data-[state=delayed-open]:ease-out",
          "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:duration-100 motion-safe:data-[state=closed]:ease-out",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
