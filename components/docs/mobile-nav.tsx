"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import type { Root } from "fumadocs-core/page-tree";
import { MenuIcon, XIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/registry/ziui/ui/button";
import { Sidebar } from "./sidebar";

type MobileNavProps = {
  tree: Root;
  links: { href: string; label: string }[];
};

export function MobileNav({ tree, links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Close on any link click inside the sheet (event delegation) instead of
  // watching the pathname in an effect: it also closes when the user taps the
  // link of the page they are already on, where the pathname never changes.
  function closeOnLinkClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <MenuIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          onClick={closeOnLinkClick}
          className="fixed inset-y-0 left-0 z-50 flex w-76 max-w-[85vw] flex-col bg-background shadow-2xl ring ring-border md:hidden"
        >
          <div className="flex h-14 shrink-0 items-center border-b border-(--hairline) pr-2 pl-4">
            <Dialog.Title className="text-[15px] font-semibold tracking-tight">ZiUI</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu" className="ml-auto">
                <XIcon />
              </Button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <nav aria-label="Main" className="flex flex-col gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex h-10 items-center rounded-lg px-3 text-[15px] text-foreground hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="my-5 h-px bg-(--hairline)" />
            <Sidebar tree={tree} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
