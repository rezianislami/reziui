import * as React from "react";

import { cn } from "@/lib/utils";

// Same surface, ring and focus outline as Input; see there for the 16px text
// below the sm breakpoint (iOS Safari zooms into smaller fields).
//
// field-sizing: content lets the box grow with its text without any script;
// min-h-20 keeps it from collapsing when empty. Browsers without field-sizing
// (Firefox) keep the 80px minimum and scroll, and resize-y lets people drag it
// taller there.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full min-w-0 resize-y rounded-md bg-card px-3 py-2 text-base text-foreground shadow-xs ring ring-input transition-[box-shadow] outline-hidden sm:text-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-ring",
        "aria-invalid:ring-destructive aria-invalid:focus-visible:outline-destructive",
        "disabled:cursor-not-allowed disabled:bg-accent disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
