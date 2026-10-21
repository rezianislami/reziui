import Link from "next/link";
import { source } from "@/lib/source";
import { Button } from "@/registry/ziui/ui/button";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

const GITHUB_URL = "https://github.com/rezianislami";

const nav = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components/button", label: "Components" },
];

function GitHubIcon() {
  // lucide-react dropped brand icons, so the mark is inlined.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export function SiteHeader() {
  const tree = source.getPageTree();
  const pageTitles = Object.fromEntries(source.getPages().map((page) => [page.url, page.data.title]));

  return (
    <header className="sticky top-0 z-40 flex h-15 items-center gap-4 border-b border-(--hairline) bg-background/85 px-4 backdrop-blur md:gap-8 md:px-6">
      <Link href="/" className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {/* Placeholder mark until the ZiUI logo exists. */}
        <span className="flex size-5.5 items-center justify-center rounded-full bg-linear-to-b from-(--btn-primary-from) to-(--btn-primary-to) text-xs font-bold text-white ring ring-(--btn-primary-ring)">
          Z
        </span>
        <span className="text-[15px] font-semibold tracking-tight">ZiUI</span>
      </Link>
      <nav aria-label="Main" className="hidden items-center gap-6 text-sm md:flex">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <SearchDialog pageTitles={pageTitles} />
        <ThemeToggle />
        <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
        </Button>
        <MobileNav tree={tree} links={nav} />
      </div>
    </header>
  );
}
