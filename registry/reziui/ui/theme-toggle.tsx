"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/registry/reziui/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/reziui/ui/tooltip";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render and CSS picks one via the `dark` class, so the server
  // HTML matches the client before next-themes knows the resolved theme —
  // branching on resolvedTheme here would cause a hydration mismatch.
  //
  // The trigger is the button itself, styled with buttonVariants, instead of
  // wrapping <Button> with `asChild`: the shadcn CLI rewrites `asChild` to
  // Base UI's `render` when installing into a Base UI project, which the
  // Radix trigger does not accept.
  return (
    <Tooltip>
      <TooltipTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <MoonIcon className="dark:hidden" />
        <SunIcon className="hidden dark:block" />
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}
