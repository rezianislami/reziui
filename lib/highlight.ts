import { highlight } from "fumadocs-core/highlight";

export async function highlightCode(code: string, lang: "tsx") {
  return highlight(code, { lang });
}
