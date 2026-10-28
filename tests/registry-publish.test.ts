import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/registry.json";
import { SITE_URL } from "@/lib/site";

// The deployed site serves public/r/*.json as-is, so these guard what a
// consumer's `shadcn add` will fetch, without needing a build or a deploy.
const builtDir = resolve(process.cwd(), "public/r");
const built = (name: string) => existsSync(resolve(builtDir, `${name}.json`));

describe("published registry", () => {
  it("has a built file for every registry item", () => {
    const missing = registry.items.map((item) => item.name).filter((name) => !built(name));

    expect(missing, "run `npm run registry:build`").toEqual([]);
  });

  it("resolves every @reziui dependency to a built file", () => {
    const deps = registry.items.flatMap((item) =>
      (item.registryDependencies ?? []).filter((dep) => dep.startsWith("@reziui/")),
    );

    expect(deps.length).toBeGreaterThan(0);
    for (const dep of deps) expect(built(dep.slice("@reziui/".length)), dep).toBe(true);
  });

  it("does not depend on its own items by bare name", () => {
    // A bare name resolves to shadcn's own registry, so `button` would install
    // shadcn's Button instead of ours.
    const own = new Set(registry.items.map((item) => item.name));
    const bare = registry.items.flatMap((item) =>
      (item.registryDependencies ?? []).filter((dep) => own.has(dep)).map((dep) => `${item.name} → ${dep}`),
    );

    expect(bare).toEqual([]);
  });

  it("documents a concrete registry URL, not a placeholder", () => {
    const doc = readFileSync(resolve(process.cwd(), "content/docs/installation.mdx"), "utf8");
    const urls = [...doc.matchAll(/https:\/\/[^\s"`]+\/r\/\{name\}\.json/g)].map((m) => m[0]);

    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls).size, "every snippet uses the same URL").toBe(1);
    expect(urls[0]).not.toMatch(/[<>]/);
    expect(urls[0], "docs and metadataBase must name the same host").toBe(`${SITE_URL}/r/{name}.json`);
  });

  it("ships a 1200×630 Open Graph image with alt text", () => {
    const png = readFileSync(resolve(process.cwd(), "app/opengraph-image.png"));
    // PNG IHDR: width and height are big-endian uint32s at byte 16 and 20.
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    expect(readFileSync(resolve(process.cwd(), "app/opengraph-image.alt.txt"), "utf8").trim()).not.toBe("");
  });
});
