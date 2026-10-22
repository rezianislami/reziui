import type { Root } from "fumadocs-core/page-tree";
import { describe, expect, it } from "vitest";
import { browseGroups, isNewPage, NEW_PAGE_DAYS } from "@/lib/docs-index";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe("isNewPage", () => {
  const added = day("2026-10-22");

  it("is new from the day it was added", () => {
    expect(isNewPage(added, day("2026-10-22"))).toBe(true);
    expect(isNewPage(added, day("2026-11-20"))).toBe(true);
  });

  it(`stops being new after ${NEW_PAGE_DAYS} days`, () => {
    expect(isNewPage(added, day("2026-11-21"))).toBe(false);
  });

  it("is not new before its date, so a future typo can't pin the label", () => {
    expect(isNewPage(added, day("2026-10-21"))).toBe(false);
  });

  it("is not new without a date", () => {
    expect(isNewPage(undefined, day("2026-10-22"))).toBe(false);
  });
});

describe("browseGroups", () => {
  const tree = {
    name: "Docs",
    children: [
      { type: "separator", name: "Getting started" },
      { type: "page", name: "Introduction", url: "/docs" },
      { type: "separator", name: "Components" },
      {
        type: "folder",
        name: "Forms",
        index: { type: "page", name: "Forms", url: "/docs/forms" },
        children: [{ type: "page", name: "Switch", url: "/docs/components/switch" }],
      },
      { type: "page", name: "Missing", url: "/docs/missing" },
      { type: "separator", name: "Empty" },
    ],
  } as unknown as Root;
  const titles: Record<string, string> = {
    "/docs": "Introduction",
    "/docs/forms": "Forms",
    "/docs/components/switch": "Switch",
  };
  const lookup = (url: string) => (titles[url] ? { title: titles[url], description: `${titles[url]} page` } : undefined);

  it("groups pages under the sidebar's separators, in sidebar order", () => {
    expect(browseGroups(tree, lookup)).toEqual([
      { label: "Getting started", pages: [{ url: "/docs", title: "Introduction", description: "Introduction page" }] },
      {
        label: "Components",
        pages: [
          { url: "/docs/forms", title: "Forms", description: "Forms page" },
          { url: "/docs/components/switch", title: "Switch", description: "Switch page" },
        ],
      },
    ]);
  });

  it("drops empty sections and tree entries without a page", () => {
    const labels = browseGroups(tree, lookup).map((g) => g.label);
    expect(labels).not.toContain("Empty");
    expect(JSON.stringify(browseGroups(tree, lookup))).not.toContain("/docs/missing");
  });

  it("puts pages before any separator in a default group", () => {
    const flat = { name: "Docs", children: [{ type: "page", name: "Introduction", url: "/docs" }] } as unknown as Root;
    expect(browseGroups(flat, lookup)).toEqual([
      { label: "Pages", pages: [{ url: "/docs", title: "Introduction", description: "Introduction page" }] },
    ]);
  });
});
