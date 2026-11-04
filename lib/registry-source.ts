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
  return source.replaceAll(/(["'])@\/registry\/reziui\/ui\//g, "$1@/components/ui/");
}

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

/**
 * Other Rezi UI components an item imports, e.g. command → dialog. A manual
 * install has to copy these too. The theme is left out: every item depends on
 * it, and the manual steps already name it.
 */
export function getComponentDependencies(item: RegistryItem): RegistryItem[] {
  const deps: string[] = ("registryDependencies" in item && item.registryDependencies) || [];
  return deps
    .filter((dep) => dep.startsWith("@reziui/") && dep !== "@reziui/theme")
    .map((dep) => getRegistryItem(dep.slice("@reziui/".length)))
    .filter((dep): dep is RegistryItem => dep !== undefined);
}
