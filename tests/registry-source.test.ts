import { describe, expect, it } from "vitest";
import { getRegistryItem, readRegistrySource, toConsumerImports } from "@/lib/registry-source";

describe("toConsumerImports", () => {
  it("rewrites registry ui imports to the consumer components path", () => {
    expect(toConsumerImports('import { Button } from "@/registry/reziui/ui/button";')).toBe(
      'import { Button } from "@/components/ui/button";',
    );
    expect(toConsumerImports("import { Button } from '@/registry/reziui/ui/button';")).toBe(
      "import { Button } from '@/components/ui/button';",
    );
  });

  it.each([
    ['import Demo from "@/registry/reziui/examples/button-demo";', "a non-ui registry folder"],
    ["// see @/registry/reziui/ui/button for details", "an unquoted mention in a comment"],
    ['import x from "@/registry/reziui/uikit";', "a path that only starts with ui"],
  ])("leaves %s untouched (%s)", (input) => {
    expect(toConsumerImports(input)).toBe(input);
  });
});

describe("readRegistrySource", () => {
  it("reads a registry file with consumer imports applied", () => {
    const source = readRegistrySource("registry/reziui/examples/button-demo.tsx");

    expect(source).toContain('from "@/components/ui/button"');
    expect(source).not.toContain("@/registry/reziui/ui/");
  });

  it("rejects paths outside the registry folder", () => {
    expect(() => readRegistrySource("app/globals.css")).toThrow(/must live under registry\//);
  });
});

describe("getRegistryItem", () => {
  it("finds items by name and returns undefined for unknown names", () => {
    expect(getRegistryItem("button")?.type).toBe("registry:ui");
    expect(getRegistryItem("does-not-exist")).toBeUndefined();
  });
});
