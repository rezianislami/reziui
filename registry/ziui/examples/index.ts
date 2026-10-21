import type { ComponentType } from "react";
import ButtonDemo from "./button-demo";
import ButtonLoading from "./button-loading";
import ButtonSizes from "./button-sizes";
import ButtonVariants from "./button-variants";

export type Example = {
  component: ComponentType;
  /** Repo-relative source path, read at build time for the Code tab. */
  file: string;
};

// Static imports instead of next/dynamic: examples are tiny and must render in
// the prerendered HTML, which lazy loading would push behind a client boundary.
export const examples: Record<string, Example> = {
  "button-demo": { component: ButtonDemo, file: "registry/ziui/examples/button-demo.tsx" },
  "button-variants": { component: ButtonVariants, file: "registry/ziui/examples/button-variants.tsx" },
  "button-sizes": { component: ButtonSizes, file: "registry/ziui/examples/button-sizes.tsx" },
  "button-loading": { component: ButtonLoading, file: "registry/ziui/examples/button-loading.tsx" },
};
