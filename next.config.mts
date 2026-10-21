import type { NextConfig } from "next";
// fumadocs-mdx/next is ESM-only, so this config is .mts (loaded by Node's
// native TypeScript resolver) instead of .ts, which Next loads as CommonJS.
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
