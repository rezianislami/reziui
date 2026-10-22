"use client";

import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useFetchSearch, type SearchResultItem } from "fumadocs-core/search/client";
import { CornerDownLeftIcon, FileTextIcon, HashIcon, SearchIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import type { BrowseGroup } from "@/lib/docs-index";
import { cn } from "@/lib/utils";
import { Badge } from "@/registry/reziui/ui/badge";
import { Button } from "@/registry/reziui/ui/button";
import { Kbd, KbdGroup } from "@/registry/reziui/ui/kbd";

export type SearchHit = {
  id: string;
  url: string;
  type: "page" | "heading";
  title: string;
  /** Where the hit lives: the page's section for pages, the page title for headings. */
  context?: string;
};

export type SearchGroup = { label: string; hits: SearchHit[] };

/**
 * Keeps page and heading hits, grouped in that order.
 *
 * Text and table hits are dropped: their content is raw Markdown (table rows
 * come through as `| a | b |`), which reads as noise in a one-line result,
 * and every text hit already sits under a heading or page that is listed.
 */
export function groupResults(items: SearchResultItem[], pageTitles: Record<string, string>): SearchGroup[] {
  const pages: SearchHit[] = [];
  const headings: SearchHit[] = [];

  for (const item of items) {
    if (!("url" in item) || (item.type !== "page" && item.type !== "heading")) continue;
    const pageUrl = item.url.split("#")[0];
    if (item.type === "page") {
      pages.push({ id: item.id, url: item.url, type: "page", title: item.content, context: item.breadcrumbs?.at(-1) });
    } else {
      headings.push({ id: item.id, url: item.url, type: "heading", title: item.content, context: pageTitles[pageUrl] });
    }
  }

  return [
    { label: "Pages", hits: pages },
    { label: "Headings", hits: headings },
  ].filter((group) => group.hits.length > 0);
}

/** Every page as a hit. No context: the group label already names the section. */
export function browseResults(browse: BrowseGroup[]): SearchGroup[] {
  return browse.map((group) => ({
    label: group.label,
    hits: group.pages.map((page) => ({
      id: `browse:${page.url}`,
      url: page.url,
      type: "page" as const,
      title: page.title,
    })),
  }));
}

type SearchDialogProps = {
  /** Page URL → title, so heading hits can name the page they belong to. */
  pageTitles: Record<string, string>;
  /** Pages listed before anything is typed, grouped like the sidebar. */
  browse?: BrowseGroup[];
  /** Pages that carry the "New" label. */
  newUrls?: string[];
};

const NONE: never[] = [];

export function SearchDialog({ pageTitles, browse = NONE, newUrls = NONE }: SearchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  // Whether the selection last moved by arrow key. Focus stays in the input,
  // so :focus-visible can't mark the selected option; track it instead.
  const [keyboardNav, setKeyboardNav] = useState(false);
  const { search, onSearchChange, isLoading, data, error } = useFetchSearch({ api: "/api/search", delayMs: 150 });

  // An empty query lists every page instead of an empty box, so the catalog
  // can be browsed from the palette; typing switches to search results.
  const browsing = search.trim().length === 0;
  const groups = useMemo(
    () => (browsing ? browseResults(browse) : groupResults(data?.items ?? [], pageTitles)),
    [browsing, browse, data, pageTitles],
  );
  const newSet = useMemo(() => new Set(newUrls), [newUrls]);
  const hits = useMemo(() => groups.flatMap((group) => group.hits), [groups]);

  const [pressed, setPressed] = useState({ mod: false, k: false });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      const isK = event.key.toLowerCase() === "k";
      setPressed({ mod, k: mod && isK });
      if (isK && mod) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      setPressed({ mod: event.metaKey || event.ctrlKey, k: false });
    }
    // Keyup never arrives if the window loses focus mid-press (e.g. ⌘-Tab).
    function reset() {
      setPressed({ mod: false, k: false });
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", reset);
    };
  }, []);

  function changeQuery(value: string) {
    setActive(0);
    onSearchChange(value);
  }

  function go(hit: SearchHit | undefined) {
    if (!hit) return;
    setOpen(false);
    router.push(hit.url);
  }

  // Arrow keys move a virtual focus while the caret stays in the input — the
  // usual command-palette pattern; moving real focus would stop typing.
  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (hits.length === 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setKeyboardNav(true);
      setActive((index) => (index + step + hits.length) % hits.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(hits[Math.min(active, hits.length - 1)]);
    }
  }

  const activeId = hits[Math.min(active, hits.length - 1)]?.id;

  // Focus stays in the input (aria-activedescendant), so the browser never
  // scrolls the list for us; keep the selected option inside the 360px box.
  // "nearest" leaves the list still while the option is already visible.
  useEffect(() => {
    if (!activeId) return;
    document.getElementById(`search-hit-${activeId}`)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="hidden h-8.5 w-65 cursor-pointer items-center gap-2 rounded-full bg-card ps-3 pe-1.5 text-[13px] text-muted-foreground ring ring-border transition-colors outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring md:flex">
        <SearchIcon className="size-3.5" aria-hidden="true" />
        Search docs…
        {/* The keys echo the real shortcut: they press down while ⌘/Ctrl and K are held. */}
        <KbdGroup className="ms-auto" aria-hidden="true">
          <Kbd pressed={pressed.mod}>⌘</Kbd>
          <Kbd pressed={pressed.k}>K</Kbd>
        </KbdGroup>
      </Dialog.Trigger>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search docs" className="md:hidden">
          <SearchIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl bg-card text-foreground shadow-2xl ring ring-border"
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
          <div className="flex h-13 items-center gap-2.5 border-b border-(--hairline) pr-3 pl-4">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={search}
              onChange={(event) => changeQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search docs…"
              aria-label="Search docs"
              role="combobox"
              aria-expanded={hits.length > 0}
              aria-controls="search-results"
              aria-activedescendant={activeId ? `search-hit-${activeId}` : undefined}
              className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <Dialog.Close asChild>
              <Kbd className="cursor-pointer">esc</Kbd>
            </Dialog.Close>
          </div>

          <div id="search-results" role="listbox" aria-label="Results" aria-busy={isLoading} className="max-h-[min(360px,60vh)] overflow-y-auto p-2">
            {error && (
              <p role="alert" className="px-3 py-8 text-center text-sm text-muted-foreground">
                Search is unavailable right now. Try again in a moment.
              </p>
            )}
            {!error && search.length > 0 && hits.length === 0 && !isLoading && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{search}”.</p>
            )}
            {groups.map((group) => (
              <div key={group.label} role="group" aria-label={group.label}>
                <p className="px-2.5 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground">{group.label}</p>
                {group.hits.map((hit) => {
                  const selected = hit.id === activeId;
                  const Icon = hit.type === "page" ? FileTextIcon : HashIcon;
                  return (
                    <div
                      key={hit.id}
                      id={`search-hit-${hit.id}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => {
                        setActive(hits.indexOf(hit));
                        setKeyboardNav(false);
                      }}
                      onClick={() => go(hit)}
                      // One line per hit: the title leads, and the context (the page a
                      // heading belongs to) sits muted at the end. The title is capped
                      // so the context truncates first and the title stays readable.
                      // The accent fill is under 3:1 against the dialog: enough for
                      // pointer feedback, too faint to follow with the keyboard, so
                      // arrow-key selection adds an inset ring.
                      className={cn(
                        "flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2.5",
                        selected && "bg-accent",
                        selected && keyboardNav && "outline-2 outline-solid -outline-offset-2 outline-ring",
                      )}
                    >
                      <Icon
                        className={cn("size-4 shrink-0", selected ? "text-foreground" : "text-muted-foreground")}
                        aria-hidden="true"
                      />
                      <span className="flex max-w-[70%] min-w-0 shrink-0 items-center gap-1.5">
                        <span className={cn("truncate text-sm", selected ? "font-medium text-foreground" : "text-foreground/90")}>
                          {hit.title}
                        </span>
                        {hit.type === "page" && newSet.has(hit.url) && (
                          <>
                            <span className="sr-only">, new</span>
                            <Badge size="sm" aria-hidden="true" className="shrink-0">
                              New
                            </Badge>
                          </>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-end text-xs text-muted-foreground">{hit.context}</span>
                      {selected && <CornerDownLeftIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="hidden h-10 items-center gap-4 border-t border-(--hairline) bg-(--surface-elevated) px-4 text-xs text-muted-foreground sm:flex">
            {[
              ["↑↓", "navigate"],
              ["↵", "open"],
              ["esc", "close"],
            ].map(([key, label]) => (
              <span key={label} className="flex items-center gap-1.5">
                <Kbd>{key}</Kbd>
                {label}
              </span>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
