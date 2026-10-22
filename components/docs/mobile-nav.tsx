"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import type { Root } from "fumadocs-core/page-tree";
import { MenuIcon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/reziui/ui/sheet";
import { Sidebar } from "./sidebar";

type MobileNavProps = {
  tree: Root;
  links: { href: string; label: string }[];
  /** Pages that show the "New" label in the drawer's sidebar. */
  newUrls?: string[];
};

export function MobileNav({ tree, links, newUrls }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Close on any link click inside the sheet (event delegation) instead of
  // watching the pathname in an effect: it also closes when the user taps the
  // link of the page they are already on, where the pathname never changes.
  function closeOnLinkClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      {/* The registry Sheet from the start edge, so it mirrors in RTL. */}
      <SheetContent side="start" aria-describedby={undefined} onClick={closeOnLinkClick}>
        <SheetHeader>
          <SheetTitle className="whitespace-nowrap">Rezi UI</SheetTitle>
        </SheetHeader>
        <SheetBody className="px-4">
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
          <Sidebar tree={tree} newUrls={newUrls} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
