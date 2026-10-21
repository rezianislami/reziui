import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";
import { ChevronRightIcon } from "lucide-react";
import { source } from "@/lib/source";
import { CopyButton } from "@/components/docs/copy-button";
import { mdxComponents } from "@/components/docs/mdx-components";
import { Pager } from "@/components/docs/pager";
import { Toc } from "@/components/docs/toc";

type PageProps = { params: Promise<{ slug?: string[] }> };

// getText() reads the MDX file asynchronously, which Cache Components treats as
// uncached I/O during prerender; caching by slug keeps the page fully static.
async function getPageMarkdown(slug: string[] | undefined): Promise<string> {
  "use cache";
  return (await source.getPage(slug)?.data.getText("raw")) ?? "";
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const tree = source.getPageTree();
  // Sidebar groups are separators (meta.json flattens folders with "..."), so
  // they are counted as crumbs; otherwise every page has an empty trail.
  const crumbs = getBreadcrumbItems(page.url, tree, { includeSeparator: true });
  // Raw MDX for "Copy page": pasting a docs page into an LLM chat is the main use.
  const markdown = await getPageMarkdown(slug);

  return (
    <>
      <article className="mx-auto w-full max-w-3xl min-w-0 px-14 pt-9 pb-18">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            {crumbs.map((crumb, i) => (
              <Fragment key={i}>
                {i > 0 && <ChevronRightIcon className="size-3.5" aria-hidden="true" />}
                {crumb.url ? <Link href={crumb.url}>{crumb.name}</Link> : <span>{crumb.name}</span>}
              </Fragment>
            ))}
            <ChevronRightIcon className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">{page.data.title}</span>
          </nav>
        )}
        <div className="flex items-start gap-4">
          <h1 className="text-[34px] leading-tight font-semibold tracking-tight text-foreground">{page.data.title}</h1>
          <CopyButton value={markdown} variant="secondary" className="mt-2 ml-auto shrink-0">
            Copy page
          </CopyButton>
        </div>
        {page.data.description && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{page.data.description}</p>
        )}
        <div className="mt-10">
          <MDX components={mdxComponents} />
        </div>
        <Pager tree={tree} url={page.url} />
      </article>
      <aside className="sticky top-15 hidden h-[calc(100dvh-3.75rem)] w-60 shrink-0 overflow-y-auto px-6 pt-10 xl:block">
        <Toc items={page.data.toc} />
      </aside>
    </>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
