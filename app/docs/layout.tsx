import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { Sidebar } from "@/components/docs/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="w-56 shrink-0">
        <Sidebar tree={source.getPageTree()} />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
