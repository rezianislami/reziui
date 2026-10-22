import type { Node, Root } from "fumadocs-core/page-tree";

/** How long a page carries the "New" label after its `added` date. */
export const NEW_PAGE_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * True from the `added` day until NEW_PAGE_DAYS later. A date in the future
 * is not "new" yet, so a typo like 2062 can't pin a label forever.
 */
export function isNewPage(added: Date | undefined, now: Date): boolean {
  if (!added) return false;
  const age = now.getTime() - added.getTime();
  return age >= 0 && age < NEW_PAGE_DAYS * DAY_MS;
}

export type BrowsePage = { url: string; title: string };
export type BrowseGroup = { label: string; pages: BrowsePage[] };

/**
 * Flattens the page tree into the sidebar's sections, for listing every page
 * in search before anything is typed. A separator starts a section; folders
 * contribute their index page and children to the current one.
 */
export function browseGroups(tree: Root, lookup: (url: string) => Omit<BrowsePage, "url"> | undefined): BrowseGroup[] {
  const groups: BrowseGroup[] = [];
  let current: BrowseGroup | undefined;

  const add = (url: string) => {
    const page = lookup(url);
    if (!page) return;
    if (!current) groups.push((current = { label: "Pages", pages: [] }));
    current.pages.push({ url, ...page });
  };

  const visit = (node: Node) => {
    if (node.type === "separator") {
      groups.push((current = { label: String(node.name ?? ""), pages: [] }));
    } else if (node.type === "folder") {
      if (node.index) add(node.index.url);
      node.children.forEach(visit);
    } else {
      add(node.url);
    }
  };
  tree.children.forEach(visit);

  return groups.filter((group) => group.pages.length > 0);
}
