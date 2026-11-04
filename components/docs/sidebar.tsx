"use client";

import { createContext, useContext, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Node, Root } from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";
import { Badge } from "@/registry/reziui/ui/badge";

// Pages inside their "New" window, computed on the server (see getNewPageUrls).
const NewUrlsContext = createContext<ReadonlySet<string>>(new Set());

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  // trailingSlash (static export) makes the browser path /x/ while page-tree URLs are /x.
  // Matching both forms, rather than stripping the slash, keeps "/" from collapsing to "".
  const pathname = usePathname();
  const active = pathname === href || pathname === `${href}/`;
  const isNew = useContext(NewUrlsContext).has(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-3 pb-px text-sm transition-colors outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {children}
      {isNew && (
        <>
          {/* Read as "Switch, new" rather than the badge text run into the name. */}
          <span className="sr-only">, new</span>
          <Badge size="sm" aria-hidden="true" className="ms-auto">
            New
          </Badge>
        </>
      )}
    </Link>
  );
}

function SidebarNode({ node }: { node: Node }) {
  if (node.type === "separator") {
    return (
      <li className="mt-6 px-3 pb-1.5 text-xs font-medium text-muted-foreground first:mt-0">
        {node.name}
      </li>
    );
  }

  if (node.type === "folder") {
    return (
      <li>
        {node.index ? (
          <SidebarLink href={node.index.url}>{node.name}</SidebarLink>
        ) : (
          <span className="block px-3 pt-4 pb-1.5 text-xs font-medium text-muted-foreground">
            {node.name}
          </span>
        )}
        <ul className="flex flex-col gap-0.5">
          {node.children.map((child, i) => (
            <SidebarNode key={child.$id ?? i} node={child} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <SidebarLink href={node.url}>{node.name}</SidebarLink>
    </li>
  );
}

const NO_URLS: string[] = [];

export function Sidebar({ tree, newUrls = NO_URLS }: { tree: Root; newUrls?: string[] }) {
  const newSet = useMemo(() => new Set(newUrls), [newUrls]);
  return (
    <NewUrlsContext.Provider value={newSet}>
      <nav aria-label="Documentation">
        <ul className="flex flex-col gap-0.5">
          {tree.children.map((node, i) => (
            <SidebarNode key={node.$id ?? i} node={node} />
          ))}
        </ul>
      </nav>
    </NewUrlsContext.Provider>
  );
}
