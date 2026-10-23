import { highlight } from "fumadocs-core/highlight";

/**
 * Shiki highlighting behind "use cache": highlight() is async, and under Cache
 * Components an uncached await during prerender fails the build. The output
 * only depends on (code, lang), so caching it is safe and skips re-highlighting.
 */
export async function highlightCode(code: string, lang: "tsx") {
  "use cache";
  return highlight(code, { lang });
}
