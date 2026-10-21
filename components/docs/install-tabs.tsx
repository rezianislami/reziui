import { basename } from "node:path";
import { highlightCode } from "@/lib/highlight";
import { getRegistryItem, readRegistrySource } from "@/lib/registry-source";
import { CodeBlock } from "./code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

type InstallTabsProps = {
  /** Registry item name, e.g. "button". */
  name: string;
};

export async function InstallTabs({ name }: InstallTabsProps) {
  const item = getRegistryItem(name);
  if (!item) throw new Error(`Unknown registry item "${name}" in <InstallTabs />`);

  const cli = `npx shadcn@latest add @ziui/${name}`;
  const deps: string[] = ("dependencies" in item && item.dependencies) || [];
  const files: { path: string }[] = ("files" in item && item.files) || [];

  const [cliCode, depsCode, ...fileCodes] = await Promise.all([
    highlightCode(cli, "bash"),
    highlightCode(`npm install ${deps.join(" ")}`, "bash"),
    ...files.map((file) => highlightCode(readRegistrySource(file.path), "tsx")),
  ]);

  return (
    <Tabs defaultValue="cli" className="not-prose my-6">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli">
        <CodeBlock title="terminal">{cliCode}</CodeBlock>
      </TabsContent>
      <TabsContent value="manual" className="flex flex-col gap-4">
        {deps.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">Install the dependencies:</p>
            <CodeBlock title="terminal">{depsCode}</CodeBlock>
          </>
        )}
        <p className="text-sm text-muted-foreground">
          Copy the source into <code className="font-mono text-foreground">components/ui</code>, then add
          the <code className="font-mono text-foreground">@ziui/theme</code> tokens to your global CSS.
        </p>
        {files.map((file, i) => (
          <CodeBlock key={file.path} title={`components/ui/${basename(file.path)}`}>
            {fileCodes[i]}
          </CodeBlock>
        ))}
      </TabsContent>
    </Tabs>
  );
}
