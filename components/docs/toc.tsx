"use client";

import { AnchorProvider, TOCItem, type TableOfContents } from "fumadocs-core/toc";
import { cn } from "@/lib/utils";

export function Toc({ items }: { items: TableOfContents }) {
  if (items.length === 0) return null;

  return (
    <AnchorProvider toc={items} single>
      <nav aria-label="On this page" className="flex flex-col">
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
      </nav>
    </AnchorProvider>
  );
}
