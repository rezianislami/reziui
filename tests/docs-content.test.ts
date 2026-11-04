import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { examples } from "@/registry/reziui/examples";
import registry from "@/registry.json";
import { getComponentDependencies, getRegistryItem } from "@/lib/registry-source";

// ComponentPreview / InstallTabs throw at build time on unknown names; these
// tests catch a typo in MDX before a build is needed.
const docsDir = resolve(process.cwd(), "content/docs");

function mdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? mdxFiles(join(dir, entry.name)) : entry.name.endsWith(".mdx") ? [join(dir, entry.name)] : [],
  );
}

// Matches the JSX tag and its string `name` prop only, e.g.
// <ComponentPreview name="button-demo" size="sm" />. `\s` before `name`
// (not `\b`) so attributes like data-name="…" are not mistaken for it.
function namesUsed(tag: string): string[] {
  const pattern = new RegExp(`<${tag}\\b[^>]*\\sname="([^"]+)"`, "g");
  return mdxFiles(docsDir).flatMap((file) => [...readFileSync(file, "utf8").matchAll(pattern)].map((m) => m[1]));
}

describe("docs content", () => {
  it("only references examples that exist", () => {
    const used = namesUsed("ComponentPreview");

    expect(used.length).toBeGreaterThan(0);
    for (const name of used) expect(examples, name).toHaveProperty(name);
  });

  it("names the other components an item imports, without the theme", () => {
    const names = (name: string) => getComponentDependencies(getRegistryItem(name)!).map((dep) => dep.name);

    expect(names("command")).toEqual(["dialog"]);
    expect(names("theme-toggle")).toEqual(["button", "tooltip"]);
    expect(names("button")).toEqual([]);
  });

  it("has a docs page for every component the Manual tab links to", () => {
    // InstallTabs links each dependency to /docs/components/<name>.
    const linked = registry.items.flatMap((item) => getComponentDependencies(item).map((dep) => dep.name));

    expect(linked.length).toBeGreaterThan(0);
    for (const name of linked) expect(existsSync(join(docsDir, "components", `${name}.mdx`)), name).toBe(true);
  });

  it("only references registry items that exist in InstallTabs", () => {
    const used = namesUsed("InstallTabs");

    expect(used.length).toBeGreaterThan(0);
    for (const name of used) expect(getRegistryItem(name), name).toBeDefined();
  });

  it("points every example at a file on disk", () => {
    for (const [name, example] of Object.entries(examples)) {
      expect(existsSync(resolve(process.cwd(), example.file)), name).toBe(true);
    }
  });
});
