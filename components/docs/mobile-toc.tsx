"use client";

import { useState } from "react";
import type { TableOfContents } from "fumadocs-core/toc";
import { ChevronDownIcon } from "lucide-react";
import { Collapsible } from "radix-ui";
import { cn } from "@/lib/utils";

/** "On this page" for viewports where the right-hand TOC column is hidden. */
export function MobileToc({ items }: { items: TableOfContents }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="mt-5 rounded-xl bg-card ring ring-border xl:hidden">
      <Collapsible.Trigger className="flex h-10 w-full cursor-pointer items-center px-3.5 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        On this page
        <ChevronDownIcon
          className={cn("ml-auto size-4 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <nav aria-label="On this page" className="flex flex-col border-t border-(--hairline) px-3.5 py-2.5">
          {items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              onClick={() => setOpen(false)}
              className={cn("py-1 text-[13px] text-muted-foreground hover:text-foreground", item.depth > 2 && "pl-3")}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
