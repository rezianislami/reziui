import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/registry.json";
import { SITE_URL } from "@/lib/site";
import pkg from "@/package.json";

// The README is the repo's front page on GitHub. These keep it from drifting
// from the registry it advertises: a component added without a README row, a
// docs link to a page that was renamed, or an image path that no longer exists.
const root = process.cwd();
const readme = readFileSync(resolve(root, "README.md"), "utf8");
const components = registry.items.filter((item) => item.type === "registry:ui").map((item) => item.name);

describe("README", () => {
  it("lists every registry component in the components table", () => {
    const missing = components.filter((name) => !readme.includes(`| \`@reziui/${name}\` |`));

    expect(missing, "add a row to the Components table").toEqual([]);
  });

  it("does not list components the registry no longer has", () => {
    // Matches only table rows, not the `@reziui/<name>` placeholder in prose
    // or the multi-item `shadcn add` example.
    const listed = [...readme.matchAll(/\| `@reziui\/([a-z-]+)` \|/g)].map((m) => m[1]);

    expect(listed.filter((name) => !components.includes(name))).toEqual([]);
    expect(new Set(listed).size, "no duplicate rows").toBe(listed.length);
  });

  it("states the same component count as the registry", () => {
    expect(readme).toContain(`${components.length} components.`);
  });

  it("links only to docs pages that exist", () => {
    const slugs = [...readme.matchAll(/\/docs\/components\/([a-z-]+)/g)].map((m) => m[1]);
    const missing = [...new Set(slugs)].filter(
      (slug) => !existsSync(resolve(root, `content/docs/components/${slug}.mdx`)),
    );

    expect(slugs.length).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });

  it("uses the deployed site URL for every docs and registry link", () => {
    // A stale host here would send consumers' `registry add` to the wrong place.
    const hosts = [...readme.matchAll(/https:\/\/reziui\.[^/\s)"]+/g)].map((m) => m[0]);

    expect(hosts.length).toBeGreaterThan(0);
    expect([...new Set(hosts)]).toEqual([SITE_URL]);
  });

  it("references images that exist, with the banner at 2:1", () => {
    const images = [...readme.matchAll(/(?:src|srcset)="(\.github\/[^"]+)"/g)].map((m) => m[1]);

    expect(images.length).toBe(4);
    for (const path of images) expect(existsSync(resolve(root, path)), path).toBe(true);

    for (const mode of ["light", "dark"]) {
      const png = readFileSync(resolve(root, `.github/assets/banner-${mode}.png`));
      // PNG IHDR: width and height are big-endian uint32s at byte 16 and 20.
      expect(png.readUInt32BE(16), mode).toBe(png.readUInt32BE(20) * 2);
    }
  });
});

describe("license", () => {
  it("ships an MIT LICENSE that package.json agrees with", () => {
    const license = readFileSync(resolve(root, "LICENSE"), "utf8");

    expect(license).toMatch(/^MIT License/);
    expect(license).toContain("Copyright (c) 2026 rezianislami");
    expect(pkg.license).toBe("MIT");
  });
});
