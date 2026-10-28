import type { NextConfig } from "next";
// fumadocs-mdx/next is ESM-only, so this config is .mts (loaded by Node's
// native TypeScript resolver) instead of .ts, which Next loads as CommonJS.
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  // Static export served as Workers Static Assets: every page and the /r/*.json
  // registry files are build-time output, so a runtime (OpenNext) would only add
  // cost and moving parts. The trade-off: everything is computed at build, so
  // time-based output (the "New" labels) refreshes only on the next deploy.
  // Cache Components is off because Next refuses `output: "export"` with it
  // enabled (PPR needs a server), and on a static host it would do nothing.
  output: "export",
  // Emits /docs/x/index.html, which static asset hosting resolves for /docs/x/
  // without rewrite rules.
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
