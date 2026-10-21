import Link from "next/link";
import { findNeighbour, type Root } from "fumadocs-core/page-tree";

export function Pager({ tree, url }: { tree: Root; url: string }) {
  const { previous, next } = findNeighbour(tree, url);
  if (!previous && !next) return null;

  return (
    <nav aria-label="Pagination" className="mt-16 grid grid-cols-2 gap-4">
      {previous ? (
        <Link
          href={previous.url}
          className="flex flex-col gap-1 rounded-[0.75rem] bg-card px-4.5 py-3.5 ring ring-border transition-colors hover:bg-accent"
        >
          <span className="text-xs text-muted-foreground">Previous</span>
          <span className="text-sm font-medium text-foreground">← {previous.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.url}
          className="flex flex-col items-end gap-1 rounded-[0.75rem] bg-card px-4.5 py-3.5 ring ring-border transition-colors hover:bg-accent"
        >
          <span className="text-xs text-muted-foreground">Next</span>
          <span className="text-sm font-medium text-foreground">{next.name} →</span>
        </Link>
      )}
    </nav>
  );
}
