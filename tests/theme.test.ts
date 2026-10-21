import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The site's own globals.css and the published `theme` registry item carry the
// same tokens twice; these tests fail as soon as one is edited without the other.
// Paths resolve from the cwd (vitest runs at the repo root): under jsdom,
// import.meta.url is an http: URL that readFileSync rejects.
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const registry = JSON.parse(read("registry.json"));
const css = read("app/globals.css");

const theme = registry.items.find((item: { name: string }) => item.name === "theme");

function declarations(selector: string): Record<string, string> {
  const block = css.match(new RegExp(`(?:^|\\n)${selector} \\{([\\s\\S]*?)\\n\\}`))?.[1];
  if (!block) throw new Error(`${selector} block not found in globals.css`);
  const withoutComments = block.replace(/\/\*[\s\S]*?\*\//g, "");
  return Object.fromEntries(
    [...withoutComments.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
}

describe("theme tokens", () => {
  it("publishes a theme item with light and dark tokens", () => {
    expect(theme?.type).toBe("registry:theme");
    expect(Object.keys(theme.cssVars.light).length).toBeGreaterThan(0);
    expect(Object.keys(theme.cssVars.dark).length).toBeGreaterThan(0);
  });

  it.each(["light", "dark"] as const)("matches globals.css for %s mode", (mode) => {
    const actual = declarations(mode === "light" ? ":root" : "\\.dark");

    for (const [name, value] of Object.entries(theme.cssVars[mode] as Record<string, string>)) {
      expect(actual[name], `--${name} (${mode})`).toBe(value);
    }
  });

  it("defines every button token the button source references", () => {
    // Comments are stripped first: they quote example syntax like `from-(--var)`
    // that is not a real token reference.
    const source = read("registry/ziui/ui/button.tsx")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const referenced = new Set([...source.matchAll(/var\(--([\w-]+)\)|\(--([\w-]+)\)/g)].map((m) => m[1] ?? m[2]));

    for (const name of referenced) {
      expect(theme.cssVars.light, `--${name}`).toHaveProperty(name);
    }
  });

  it("depends on the theme from the button item", () => {
    const button = registry.items.find((item: { name: string }) => item.name === "button");

    expect(button.registryDependencies).toContain("@ziui/theme");
  });
});
