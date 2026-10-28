import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";
import { DELAY, ENTER } from "@/lib/motion";
import { source } from "@/lib/source";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/docs/copy-button";
import { mdxComponents } from "@/components/docs/mdx-components";
import { MobileToc } from "@/components/docs/mobile-toc";
import { Pager } from "@/components/docs/pager";
import { Toc } from "@/components/docs/toc";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/reziui/ui/breadcrumb";

type PageProps = { params: Promise<{ slug?: string[] }> };

async function getPageMarkdown(slug: string[] | undefined): Promise<string> {
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
      <article className="mx-auto w-full max-w-3xl min-w-0 px-5 pt-6 pb-16 md:px-14 md:pt-9 md:pb-18">
        {crumbs.length > 0 && (
          <Breadcrumb className={cn("mb-3", ENTER)}>
            <BreadcrumbList>
              {crumbs.map((crumb, i) => (
                <Fragment key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.url ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.url}>{crumb.name}</Link>
                      </BreadcrumbLink>
                    ) : (
                      crumb.name
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{page.data.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div className={cn("flex items-start gap-4", ENTER, DELAY[1])}>
          <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-foreground md:text-[34px]">
            {page.data.title}
          </h1>
          {/* Icon-only below sm; aria-label keeps the name once the label is display:none. */}
          <CopyButton
            value={markdown}
            variant="secondary"
            aria-label="Copy page"
            className="mt-1 ml-auto shrink-0 max-sm:size-8 max-sm:px-0 md:mt-2"
          >
            <span className="max-sm:hidden">Copy page</span>
          </CopyButton>
        </div>
        {page.data.description && (
          <p className={cn("mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base", ENTER, DELAY[2])}>{page.data.description}</p>
        )}
        <MobileToc items={page.data.toc} />
        <div className={cn("mt-8 md:mt-10", ENTER, DELAY[3])}>
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
