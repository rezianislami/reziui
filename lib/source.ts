import { defineDocs } from "fumadocs-mdx/macro";
import { loader } from "fumadocs-core/source";
import { pageSchema } from "fumadocs-core/source/schema";
import { z } from "zod";
import { isNewPage } from "./docs-index";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // `added` drives the "New" label. Coerced, because YAML turns an unquoted
    // 2026-10-22 into a Date while a quoted one stays a string; an impossible
    // date fails the build instead of silently never showing the label.
    schema: pageSchema.extend({ added: z.coerce.date().optional() }),
  },
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

/**
 * URLs of pages still inside their "New" window. The site is a static export,
 * so the clock is read at build time: a label lasts until the first deploy
 * after it expires.
 */
export async function getNewPageUrls(): Promise<string[]> {
  const now = new Date();
  return source
    .getPages()
    .filter((page) => isNewPage(page.data.added, now))
    .map((page) => page.url);
}
