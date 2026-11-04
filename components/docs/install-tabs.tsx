import { Fragment } from "react";
import { basename } from "node:path";
import Link from "next/link";
import { highlightCode } from "@/lib/highlight";
import { getComponentDependencies, getRegistryItem, readRegistrySource } from "@/lib/registry-source";
import { CodeBlock } from "./code-block";
import { CommandTokens } from "./command-tokens";
import { InstallCommand } from "./install-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";

type InstallTabsProps = {
  /** Registry item name, e.g. "button". */
  name: string;
};

export async function InstallTabs({ name }: InstallTabsProps) {
  const item = getRegistryItem(name);
  if (!item) throw new Error(`Unknown registry item "${name}" in <InstallTabs />`);

  const deps: string[] = ("dependencies" in item && item.dependencies) || [];
  const files: { path: string }[] = ("files" in item && item.files) || [];
  const components = getComponentDependencies(item);

  // Commands use the shared command colours (same as the landing page); only
  // source files go through Shiki.
  const fileCodes = await Promise.all(files.map((file) => highlightCode(readRegistrySource(file.path), "tsx")));

  return (
    <Tabs defaultValue="cli" className="not-prose my-6">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli">
        <InstallCommand name={name} />
      </TabsContent>
      <TabsContent value="manual" className="flex flex-col gap-4">
        {deps.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">Install the dependencies:</p>
            <CodeBlock title="terminal">
              <pre>
                <code>
                  <CommandTokens command={`npm install ${deps.join(" ")}`} />
                </code>
              </pre>
            </CodeBlock>
          </>
        )}
        <p className="text-sm text-muted-foreground">
          Copy the source into <code className="font-mono text-foreground">components/ui</code>, then add
          the <code className="font-mono text-foreground">@reziui/theme</code> tokens to your global CSS. It
          imports <code className="font-mono text-foreground">cn</code> from{" "}
          <code className="font-mono text-foreground">lib/utils</code>, which{" "}
          <code className="font-mono text-foreground">shadcn init</code> creates.
        </p>
        {components.length > 0 && (
          <p className="text-sm text-muted-foreground">
            It also imports{" "}
            {components.map((dep, i) => (
              <Fragment key={dep.name}>
                {i > 0 && (i === components.length - 1 ? " and " : ", ")}
                <Link
                  href={`/docs/components/${dep.name}`}
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  {dep.title}
                </Link>
              </Fragment>
            ))}
            ; install {components.length > 1 ? "those" : "that"} first.
          </p>
        )}
        {files.map((file, i) => (
          <CodeBlock key={file.path} title={`components/ui/${basename(file.path)}`}>
            {fileCodes[i]}
          </CodeBlock>
        ))}
      </TabsContent>
    </Tabs>
  );
}
