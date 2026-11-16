import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { source } from "@/lib/source";

// Static export: emitted once at build as out/sitemap.xml.
export const dynamic = "force-static";

// Trailing slash because next.config sets `trailingSlash: true`: /docs/x 308s to
// /docs/x/, and listing the redirecting form would make Google index a hop.
const absolute = (path: string) => `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ["/", ...source.getPages().map((page) => page.url)];
  return [...new Set(urls)].map((path) => ({ url: absolute(path) }));
}
