import type { ComponentProps } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { ComponentPreview } from "./component-preview";
import { InstallTabs } from "./install-tabs";

// Headings keep the `id` remark-heading generates so TOC anchors resolve;
// scroll-mt clears the sticky header when jumping to an anchor.
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mt-12 mb-4 scroll-mt-24 text-[22px] font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-8 mb-3 scroll-mt-24 text-base font-semibold text-foreground", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("my-4 text-sm leading-relaxed text-muted-foreground", className)} {...props} />
  ),
  a: ({ className, href = "", ...props }) => {
    const cls = cn("font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground", className);
    return href.startsWith("/") ? (
      <Link href={href} className={cls} {...props} />
    ) : (
      <a href={href} className={cls} target="_blank" rel="noreferrer" {...props} />
    );
  },
  ul: ({ className, ...props }) => (
    <ul className={cn("my-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-4 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground", className)} {...props} />
  ),
  strong: ({ className, ...props }) => <strong className={cn("font-semibold text-foreground", className)} {...props} />,
  // Inline code only: fenced blocks arrive as <pre><code> and are styled by CodeBlock.
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-md bg-accent px-1.5 py-0.5 font-mono text-[0.85em] text-foreground [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-[1em]",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ title, ...props }: ComponentProps<"pre">) => (
    <CodeBlock className="my-5" title={title}>
      <pre {...props} />
    </CodeBlock>
  ),
  table: ({ className, ...props }) => (
    <div className="my-5 overflow-x-auto rounded-[0.75rem] bg-card ring ring-border">
      <table className={cn("w-full text-left text-[13px]", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("border-b border-(--hairline) bg-(--surface-elevated) px-4 py-2.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-b border-(--hairline) px-4 py-2.5 align-top text-muted-foreground [tr:last-child_&]:border-0", className)}
      {...props}
    />
  ),
  ComponentPreview,
  InstallTabs,
};
