"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/registry/reziui/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/reziui/ui/tooltip";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render and CSS picks one via the `dark` class, so the server
  // HTML matches the client before next-themes knows the resolved theme —
  // branching on resolvedTheme here would cause a hydration mismatch.
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <MoonIcon className="dark:hidden" />
          <SunIcon className="hidden dark:block" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}
