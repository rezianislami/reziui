import { basename } from "node:path";
import { highlightCode } from "@/lib/highlight";
import { examples } from "@/registry/reziui/examples";
import { readRegistrySource } from "@/lib/registry-source";
import { CodeBlock } from "./code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";

type ComponentPreviewProps = {
  /** Key in the examples map, e.g. "button-demo". */
  name: string;
  /** Stage height; the hero preview is taller than per-example previews. */
  size?: "default" | "sm";
};

export async function ComponentPreview({ name, size = "default" }: ComponentPreviewProps) {
  const example = examples[name];
  // Fail the build loudly: a typo in MDX would otherwise ship an empty preview.
  if (!example) throw new Error(`Unknown example "${name}" in <ComponentPreview />`);

  const Example = example.component;
  const code = await highlightCode(readRegistrySource(example.file), "tsx");

  return (
    <Tabs defaultValue="preview" className="not-prose my-6">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div
          data-slot="preview-stage"
          className={
            size === "sm"
              ? "flex min-h-36 items-center justify-center rounded-[0.75rem] bg-card p-6 ring ring-border md:p-8"
              : "flex min-h-56 items-center justify-center rounded-[0.75rem] bg-card p-6 ring ring-border md:min-h-72 md:p-10"
          }
        >
          <Example />
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock title={basename(example.file)}>{code}</CodeBlock>
      </TabsContent>
    </Tabs>
  );
}
