import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRightIcon, BlocksIcon, TerminalIcon } from "lucide-react";
import { GitHubIcon, SiteHeader } from "@/components/docs/site-header";
import { InstallCommand } from "@/components/docs/install-command";
import { Announcement } from "@/components/landing/announcement";
import { Principles } from "@/components/landing/principles";
import { ShowcaseCard } from "@/components/landing/showcase-card";
import { SpotlightGrid } from "@/components/landing/spotlight-grid";
import { componentCount, everyday, GITHUB_URL, recentlyAdded, type Showcase } from "@/components/landing/showcases";
import { getNewPageUrls } from "@/lib/source";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/reziui/ui/button";

// Hero entrance: each block fades and rises 8px, 100ms after the previous
// one, once on load. fill-mode both keeps a block hidden until its turn. All
// motion-safe:, so with reduced motion everything is simply there.
const enter =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-400 motion-safe:ease-[cubic-bezier(0.2,0,0,1)] motion-safe:fill-mode-both";
const step = [
  "",
  "motion-safe:[animation-delay:100ms]",
  "motion-safe:[animation-delay:200ms]",
  "motion-safe:[animation-delay:300ms]",
  "motion-safe:[animation-delay:400ms]",
  "motion-safe:[animation-delay:500ms]",
];

const footerLink =
  "rounded-sm outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

function SectionHeading({ eyebrow, title, id, link }: { eyebrow: string; title: string; id: string; link?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        <h2 id={id} className="text-[28px] leading-tight font-semibold tracking-[-0.6px] sm:text-4xl sm:tracking-[-0.9px]">
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
      <Announcement titles={newTitles} />
      <SiteHeader newUrls={newUrls} />

      <main className="flex flex-1 flex-col items-center">
        <section className="flex w-full flex-col items-center gap-5 px-6 pt-12 pb-8 text-center sm:gap-6 sm:pt-24 sm:pb-10">
          <p className={cn("flex h-9 items-center gap-3 rounded-full bg-card px-4 text-[13px] shadow-xs ring ring-border", enter, step[0])}>
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
            <span className={cn(enter, step[1])}>
              The details you’d skip<span className="sm:hidden"> are</span>
            </span>
            <span className={cn("mt-1.5 flex items-center gap-3.5 sm:mt-0", enter, step[2])}>
              <span className="hidden sm:inline">are</span>
              {/* The tint is a pseudo-element so it can sweep in (scale on the
                  x axis from the left) while the words stay put. */}
              <span
                className={cn(
                  "relative isolate rounded-lg px-2.5 pb-[3px] text-(--info-text) sm:rounded-[0.625rem] sm:px-3 sm:pb-1",
                  "before:absolute before:inset-0 before:-z-10 before:origin-left before:rounded-[inherit] before:bg-(--info-tint) before:ring before:ring-(--info-ring) before:ring-inset",
                  "motion-safe:before:animate-highlight-sweep",
                )}
              >
                already done.
              </span>
            </span>
          </h1>
          <p className={cn("max-w-[660px] text-base leading-normal text-pretty text-muted-foreground sm:text-lg", enter, step[3])}>
            Accessible, motion-tuned React components with focus rings, reduced motion and dark mode handled — copy
            them in with the shadcn CLI.
          </p>
          <div className={cn("flex flex-wrap items-center justify-center gap-2.5 pt-2 sm:gap-3", enter, step[4])}>
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
            enter,
            step[5],
          )}
        >
          <p className="text-sm text-muted-foreground">Distributed through the shadcn CLI.</p>
          <InstallCommand />
        </section>

        <section aria-labelledby="handled" className="flex w-full max-w-[1248px] flex-col gap-7 px-6 pb-14 sm:pb-24">
          <SectionHeading eyebrow="Built in" title="Handled for you" id="handled" />
          <Principles />
        </section>

        <section aria-labelledby="new" className="flex w-full max-w-[1248px] scroll-mt-20 flex-col gap-7 px-6 pb-14 sm:pb-24">
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
