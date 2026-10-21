"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Node, Root } from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 items-center rounded-md px-3 pb-px text-sm transition-colors outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {children}
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

export function Sidebar({ tree }: { tree: Root }) {
  return (
    <nav aria-label="Documentation">
      <ul className="flex flex-col gap-0.5">
        {tree.children.map((node, i) => (
          <SidebarNode key={node.$id ?? i} node={node} />
        ))}
      </ul>
    </nav>
  );
}
