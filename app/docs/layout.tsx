import type { ReactNode } from "react";
import { getNewPageUrls, source } from "@/lib/source";
import { SiteHeader } from "@/components/docs/site-header";
import { Sidebar } from "@/components/docs/sidebar";

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const newUrls = await getNewPageUrls();

  return (
    <>
      <SiteHeader newUrls={newUrls} />
      <div className="flex flex-1">
        {/* Sticky below the 60px header; scrolls on its own when the list outgrows
            the viewport. Below md the same tree lives in the header's drawer. */}
        <aside className="sticky top-15 hidden h-[calc(100dvh-3.75rem)] w-66 shrink-0 overflow-y-auto px-5 pt-7 pb-10 md:block">
          <Sidebar tree={source.getPageTree()} newUrls={newUrls} />
        </aside>
        <div className="flex min-w-0 flex-1 md:border-l md:border-(--hairline)">{children}</div>
      </div>
    </>
  );
}
