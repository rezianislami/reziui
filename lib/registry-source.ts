import { readFileSync } from "node:fs";
import { join } from "node:path";
import registry from "@/registry.json";

type RegistryItem = (typeof registry)["items"][number];

/**
 * Rewrites registry-internal imports to the paths a consumer gets after
 * `shadcn add`, so copied snippets work as-is (the CLI does the same rewrite
 * when it writes files into a project).
 */
export function toConsumerImports(source: string): string {
  return source.replaceAll(/(["'])@\/registry\/ziui\/ui\//g, "$1@/components/ui/");
}

// Synchronous on purpose: with Cache Components, readFileSync counts as a
// predictable value baked into the static shell, while an awaited readFile()
// is uncached I/O that fails prerendering outside "use cache" or <Suspense>.
//
// The path is joined under a literal "registry" segment so Turbopack's file
// tracing is scoped to that folder; a fully dynamic join(cwd, path) makes it
// trace the whole project (public/ included) into the server output.
export function readRegistrySource(repoPath: string): string {
  const prefix = "registry/";
  if (!repoPath.startsWith(prefix)) {
    throw new Error(`Registry source must live under ${prefix}: ${repoPath}`);
  }
  const source = readFileSync(join(process.cwd(), "registry", repoPath.slice(prefix.length)), "utf8");
  return toConsumerImports(source).trimEnd();
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return registry.items.find((item) => item.name === name);
}
