"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/registry/ziui/ui/button";

type CopyButtonProps = Omit<ButtonProps, "value" | "onClick"> & {
  /** Text to copy, or a getter so callers can read it lazily from the DOM. */
  value: string | (() => string);
  /** Visible label; omit for an icon-only button (aria-label is then required). */
  children?: ReactNode;
};

const RESET_MS = 1500;

export function CopyButton({ value, children, variant = "ghost", size, ...props }: CopyButtonProps) {
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

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (children ? "sm" : "icon-sm")}
      data-copied={copied || undefined}
      onClick={handleCopy}
      {...props}
    >
      <Icon />
      {children}
    </Button>
  );
}
