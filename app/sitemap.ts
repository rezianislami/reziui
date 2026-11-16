import type { MetadataRoute } from "next";
import { SITE_URL, withTrailingSlash } from "@/lib/site";
import { source } from "@/lib/source";

// Static export: emitted once at build as out/sitemap.xml.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ["/", ...source.getPages().map((page) => page.url)];
  return [...new Set(urls)].map((path) => ({ url: `${SITE_URL}${withTrailingSlash(path)}` }));
}
