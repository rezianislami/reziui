import { describe, expect, it, vi } from "vitest";
import { SITE_URL } from "@/lib/site";

// lib/source compiles MDX through a fumadocs macro that only the Next build
// runs, so the page list is stubbed; `npm run build` emits the real sitemap.
vi.mock("@/lib/source", () => ({
  source: {
    getPages: () => [{ url: "/docs" }, { url: "/docs/components/button" }, { url: "/docs/components/button" }, { url: "/docs/forms/" }],
  },
}));

const { default: sitemap } = await import("@/app/sitemap");
const { default: robots } = await import("@/app/robots");

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists the home page and every docs page", () => {
    expect(urls).toEqual([
      `${SITE_URL}/`,
      `${SITE_URL}/docs/`,
      `${SITE_URL}/docs/components/button/`,
      `${SITE_URL}/docs/forms/`,
    ]);
  });

  it("uses absolute URLs on the canonical host, never workers.dev", () => {
    for (const url of urls) {
      expect(url.startsWith(`${SITE_URL}/`)).toBe(true);
      expect(url).not.toContain("workers.dev");
    }
  });

  it("ends every URL with exactly one slash, matching trailingSlash", () => {
    for (const url of urls) {
      expect(url).toMatch(/[^/]\/$/);
    }
  });

  it("has no duplicates", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  it("allows everything and points at the sitemap", () => {
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` });
  });
});
