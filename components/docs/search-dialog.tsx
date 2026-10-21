"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFetchSearch } from "fumadocs-core/search/client";
import { FileTextIcon, HashIcon, SearchIcon } from "lucide-react";
import { Dialog } from "radix-ui";

/**
 * Minimal ⌘K search: functional placeholder until the dialog gets its own
 * design. Results come from the fumadocs search route (/api/search).
 */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const { search, onSearchChange, isLoading, data } = useFetchSearch({ api: "/api/search", delayMs: 150 });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Table rows (prop tables) carry no standalone content worth listing.
  const results = data?.items.filter((item) => item.type !== "table") ?? [];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="flex h-8.5 w-64 cursor-pointer items-center gap-2 rounded-full bg-card pr-1.5 pl-3 text-[13px] text-muted-foreground ring ring-border transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <SearchIcon className="size-3.5" aria-hidden="true" />
        Search docs…
        <kbd className="ml-auto rounded-full bg-accent px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-[15vh] left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl bg-card text-foreground shadow-2xl ring ring-border"
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-(--hairline) px-4">
            <SearchIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search docs…"
              aria-label="Search docs"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-80 overflow-y-auto p-2" aria-busy={isLoading}>
            {search.length > 0 && results.length === 0 && !isLoading && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</li>
            )}
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
                >
                  {item.type === "page" ? (
                    <FileTextIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <HashIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="truncate">{item.content}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
