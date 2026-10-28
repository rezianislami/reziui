"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { sweepTheme } from "@/lib/theme-sweep";
import { buttonVariants } from "@/registry/reziui/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/reziui/ui/tooltip";

// The registry ThemeToggle's markup, plus the circular sweep on switch. The
// sweep stays out of the registry item: it needs global ::view-transition
// rules on the root, which would take over every view transition in a
// consumer's app. A copy rather than a wrapper, so the registry file stays
// untouched and nothing here depends on its internals.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render and CSS picks one via the `dark` class, so the server
  // HTML matches the client before next-themes knows the resolved theme.
  return (
    <Tooltip>
      <TooltipTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label="Toggle theme"
        onClick={(e) => {
          // From the button's centre, so mouse and keyboard look the same.
          const r = e.currentTarget.getBoundingClientRect();
          sweepTheme(resolvedTheme === "dark" ? "light" : "dark", setTheme, {
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + r.height / 2),
          });
        }}
      >
        <MoonIcon className="dark:hidden" />
        <SunIcon className="hidden dark:block" />
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}
