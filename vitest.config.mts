import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// No @vitejs/plugin-react: its optional Babel 8 peer conflicts with the
// Babel 7 tree pulled in by the shadcn CLI. Vite's built-in transform already
// handles TSX with the automatic JSX runtime, which is all the tests need.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
