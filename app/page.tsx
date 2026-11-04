import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRightIcon, BlocksIcon, TerminalIcon } from "lucide-react";
import { GitHubIcon, SiteHeader } from "@/components/docs/site-header";
import { InstallCommand } from "@/components/docs/install-command";
import { Announcement } from "@/components/landing/announcement";
import { HeroHighlight } from "@/components/landing/hero-highlight";
import { Principles } from "@/components/landing/principles";
import { ShowcaseCard } from "@/components/landing/showcase-card";
import { SpotlightGrid } from "@/components/landing/spotlight-grid";
import { componentCount, everyday, recentlyAdded, type Showcase } from "@/components/landing/showcases";
import { DELAY, ENTER, ENTER_TOP } from "@/lib/motion";
import { GITHUB_URL } from "@/lib/site";
import { getNewPageUrls } from "@/lib/source";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/reziui/ui/button";


const footerLink =
  "rounded-sm outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

function SectionHeading({ eyebrow, title, id, link }: { eyebrow: string; title: string; id: string; link?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        {/* scroll-margin belongs on the element that carries the id: an anchor
            jump reads it from the target only. 136px clears the sticky
            banner + header (100px) plus the eyebrow line above the title. */}
        <h2 id={id} className="scroll-mt-34 text-[28px] leading-tight font-semibold tracking-[-0.6px] sm:text-4xl sm:tracking-[-0.9px]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href="/docs/components/button"
          className="hidden items-center gap-1.5 rounded-sm pb-2 text-sm font-medium text-muted-foreground outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex"
        >
          Browse all {componentCount} components
          <ArrowRightIcon className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function Grid({ items, newUrls }: { items: Showcase[]; newUrls: string[] }) {
  return (
    <SpotlightGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ title, slug, description, Preview }, index) => {
        const href = `/docs/components/${slug}`;
        // Column in the 2- and 4-column layouts, for the left-to-right wave.
        const columns = { "--col-sm": index % 2, "--col-lg": index % 4 } as CSSProperties;
        return (
          <ShowcaseCard
            key={slug}
            title={title}
            description={description}
            href={href}
            isNew={newUrls.includes(href)}
            className="scroll-reveal spotlight"
            style={columns}
          >
            <Preview />
          </ShowcaseCard>
        );
      })}
    </SpotlightGrid>
  );
}

export default async function Home() {
  const newUrls = await getNewPageUrls();
  const newTitles = recentlyAdded.map((item) => item.title);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Banner and header stick as one block, so the header stays flush under
          the banner. Sticking each one separately would need the header's
          offset to know the banner's height, which wraps on narrow screens;
          the header's own sticky is a no-op inside this wrapper. Anchor
          targets on this page clear both (scroll-mt on SectionHeading). */}
      <div className={cn("sticky top-0 z-40", ENTER_TOP)}>
        <Announcement titles={newTitles} />
        <SiteHeader newUrls={newUrls} />
      </div>

      <main className="flex flex-1 flex-col items-center">
        <section className="flex w-full flex-col items-center gap-5 px-6 pt-12 pb-8 text-center sm:gap-6 sm:pt-24 sm:pb-10">
          <p className={cn("flex h-9 items-center gap-3 rounded-full bg-card px-4 text-[13px] shadow-xs ring ring-border", ENTER, DELAY[0])}>
            <span className="flex items-center gap-1.5">
              <BlocksIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <strong className="font-semibold">{componentCount}</strong>
              <span className="text-muted-foreground">components</span>
            </span>
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <span className="flex items-center gap-1.5">
              <TerminalIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <strong className="font-semibold">shadcn</strong>
              <span className="text-muted-foreground">compatible</span>
            </span>
          </p>
          {/* Phones: "The details you’d skip are" / [already done.]. From sm:
              "The details you’d skip" / "are [already done.]". Each "are" is
              display:none on the other layout, so screen readers hear the
              sentence once. */}
          <h1 className="flex max-w-3xl flex-col items-center text-[40px] leading-[1.05] font-semibold tracking-[-1.2px] text-balance sm:text-[64px] sm:tracking-[-2px]">
            <span className={cn(ENTER, DELAY[1])}>
              The details you’d skip<span className="sm:hidden"> are</span>
            </span>
            <span className={cn("mt-1.5 flex items-center gap-3.5 sm:mt-0", ENTER, DELAY[2])}>
              <span className="hidden sm:inline">are</span>
              <HeroHighlight>already done.</HeroHighlight>
            </span>
          </h1>
          <p className={cn("max-w-[660px] text-base leading-normal text-pretty text-muted-foreground sm:text-lg", ENTER, DELAY[3])}>
            Accessible, motion-tuned React components with focus rings, reduced motion and dark mode handled — copy
            them in with the shadcn CLI.
          </p>
          <div className={cn("flex flex-wrap items-center justify-center gap-2.5 pt-2 sm:gap-3", ENTER, DELAY[4])}>
            <Button asChild size="lg">
              <Link href="/docs/components/button">Browse components</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <GitHubIcon />
                Star on GitHub
              </a>
            </Button>
          </div>
        </section>

        <section
          aria-label="Install"
          className={cn(
            "flex w-full max-w-[672px] flex-col items-center gap-4 px-6 pt-4 pb-16 sm:px-0 sm:pt-10 sm:pb-26",
            ENTER,
            DELAY[5],
          )}
        >
          <p className="text-sm text-muted-foreground">Distributed through the shadcn CLI.</p>
          <InstallCommand />
        </section>

        <section aria-labelledby="handled" className="flex w-full max-w-[1248px] flex-col gap-7 px-6 pb-14 sm:pb-24">
          <SectionHeading eyebrow="Built in" title="Handled for you" id="handled" />
          <Principles />
        </section>

        <section aria-labelledby="new" className="flex w-full max-w-[1248px] flex-col gap-7 px-6 pb-14 sm:pb-24">
          <SectionHeading eyebrow="New" title="Recently added" id="new" />
          <Grid items={recentlyAdded} newUrls={newUrls} />
        </section>

        <section aria-labelledby="components" className="flex w-full max-w-[1248px] flex-col gap-7 px-6 pb-14 sm:pb-28">
          <SectionHeading eyebrow="Components" title="Built for everyday UI" id="components" link />
          <Grid items={everyday} newUrls={newUrls} />
          <Button asChild variant="secondary" className="w-full sm:hidden">
            <Link href="/docs/components/button">Browse all {componentCount} components</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-(--hairline)">
        <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-3 px-6 py-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center">
          <span>Rezi UI</span>
          <nav aria-label="Footer" className="flex gap-5 sm:ms-auto">
            <Link href="/docs" className={footerLink}>
              Docs
            </Link>
            <Link href="/docs/components/button" className={footerLink}>
              Components
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={footerLink}>
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
