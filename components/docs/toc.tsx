"use client";

import { AnchorProvider, TOCItem, type TableOfContents } from "fumadocs-core/toc";
import { SquarePenIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TocProps = {
  items: TableOfContents;
  /** Link to the page source for the "Edit this page" action; hidden when absent. */
  editUrl?: string;
};

export function Toc({ items, editUrl }: TocProps) {
  if (items.length === 0 && !editUrl) return null;

  return (
    <AnchorProvider toc={items} single>
      <nav aria-label="On this page" className="flex flex-col">
        {items.length > 0 && (
          <>
            <p className="mb-3 text-xs font-medium text-foreground">On this page</p>
            {items.map((item) => (
              <TOCItem
                key={item.url}
                href={item.url}
                className={cn(
                  "border-l border-(--hairline) py-1 pl-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground",
                  "data-[active=true]:border-foreground data-[active=true]:text-foreground",
                  // h3 entries indent under their h2.
                  item.depth > 2 && "pl-6",
                )}
              >
                {item.title}
              </TOCItem>
            ))}
          </>
        )}
        {editUrl && (
          <a
            href={editUrl}
            className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <SquarePenIcon className="size-3.5" aria-hidden="true" />
            Edit this page
          </a>
        )}
      </nav>
    </AnchorProvider>
  );
}
