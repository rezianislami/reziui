import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The shadcn CLI rewrites components it installs into a Base UI project
// (`base-*` styles, the CLI's default since Base UI support): every JSX
// `asChild` attribute becomes Base UI's `render` prop. Rezi UI is built on
// Radix, which has no `render` prop, so any such attribute breaks the
// consumer's type check. Registry sources compose without writing `asChild`
// in JSX; consumers may still pass it, since that code is never rewritten.
const uiDir = resolve(process.cwd(), "registry/reziui/ui");

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

// A JSX opening tag (capitalised component or member expression, e.g.
// <SelectPrimitive.Icon) followed, within the same tag, by an `asChild`
// attribute. `[^<>]*` keeps the match inside one tag, so a generic such as
// ComponentProps<typeof X> & { asChild?: boolean } cannot complete it.
const jsxAsChild = /<[A-Z][\w.]*(?=[\s>/])[^<>]*?\sasChild(?=[\s=/>])/g;

export function findJsxAsChild(source: string): string[] {
  return [...stripComments(source).matchAll(jsxAsChild)].map((m) => m[0].split(/\s/)[0]);
}

describe("registry portability", () => {
  it("flags an asChild attribute written in JSX", () => {
    expect(findJsxAsChild("<TooltipTrigger asChild>\n  <Button />\n</TooltipTrigger>")).toEqual(["<TooltipTrigger"]);
    expect(findJsxAsChild('<SelectPrimitive.Icon\n  className="x"\n  asChild\n>')).toEqual(["<SelectPrimitive.Icon"]);
  });

  it("ignores asChild in prop declarations, types and comments", () => {
    const benign = [
      "function Button({ asChild = false, ...props }: ButtonProps) {}",
      "type P = React.ComponentProps<typeof Slot.Root> & { asChild?: boolean };",
      "// so `asChild` keeps working with a single child",
      "const Comp = asChild ? Slot.Root : \"button\";",
      '<Comp data-as-child="asChild" />',
    ].join("\n");

    expect(findJsxAsChild(benign)).toEqual([]);
  });

  it("writes no asChild attribute in any registry component", () => {
    const offenders = readdirSync(uiDir)
      .filter((file) => file.endsWith(".tsx"))
      .flatMap((file) => findJsxAsChild(readFileSync(resolve(uiDir, file), "utf8")).map((tag) => `${file}: ${tag}`));

    expect(offenders).toEqual([]);
  });
});
