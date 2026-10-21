"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/registry/reziui/ui/button";

type CopyButtonProps = Omit<ButtonProps, "value" | "onClick"> & {
  /** Text to copy, or a getter so callers can read it lazily from the DOM. */
  value: string | (() => string);
  /** Visible label; omit for an icon-only button (aria-label is then required). */
  children?: ReactNode;
};

const RESET_MS = 1500;

export function CopyButton({ value, children, variant = "ghost", size, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    const text = typeof value === "function" ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access is denied outside secure contexts or without a user
      // gesture; leave the icon unchanged so the user can tell nothing copied.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  // Both icons stay mounted in one grid cell and cross-fade (scale 0.25→1,
  // opacity, blur 4px→0) instead of swapping, so the change animates both ways
  // without a motion library. Under reduced motion they switch instantly; the
  // icon change itself remains the static cue that the copy worked.
  const swap =
    "motion-safe:transition-[opacity,scale,filter] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)] [grid-area:1/1]";

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (children ? "sm" : "icon-sm")}
      data-copied={copied || undefined}
      onClick={handleCopy}
      className={cn(children && "has-[>[data-slot=icon-swap]:first-child]:ps-2", className)}
      {...props}
    >
      <span data-slot="icon-swap" aria-hidden="true" className="grid size-4 place-items-center">
        <CopyIcon className={cn(swap, copied && "scale-25 opacity-0 blur-[4px]")} />
        <CheckIcon className={cn(swap, !copied && "scale-25 opacity-0 blur-[4px]")} />
      </span>
      {children}
    </Button>
  );
}
