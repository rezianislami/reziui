import Link from "next/link";
import type { Node, Root } from "fumadocs-core/page-tree";

// Placeholder structure only: rendered straight from the fumadocs page tree.
// Visual design (active state, collapsible folders, mobile drawer) lands once
// the docs layout is designed in Pencil.
function SidebarNode({ node }: { node: Node }) {
  if (node.type === "separator") {
    return (
      <li className="mt-4 mb-1 text-xs font-medium text-muted-foreground">
        {node.name}
      </li>
    );
  }

  if (node.type === "folder") {
    return (
      <li>
        {node.index ? (
          <Link href={node.index.url}>{node.name}</Link>
        ) : (
          <span className="font-medium">{node.name}</span>
        )}
        <ul className="ml-3">
          {node.children.map((child, i) => (
            <SidebarNode key={child.$id ?? i} node={child} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <Link href={node.url} className="block py-1 text-sm hover:underline">
        {node.name}
      </Link>
    </li>
  );
}

export function Sidebar({ tree }: { tree: Root }) {
  return (
    <nav aria-label="Documentation">
      <ul>
        {tree.children.map((node, i) => (
          <SidebarNode key={node.$id ?? i} node={node} />
        ))}
      </ul>
    </nav>
  );
}
