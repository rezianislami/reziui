import { Fragment } from "react";

// Colours for terminal commands (install lines on the landing page and the
// docs). Not Shiki: its bash grammar paints everything after the program name
// as one string colour, so `add`, the package and its scope would all look the
// same. These keep github-light / github-dark hues (the themes the docs use for
// source code) but give each part of the command its own role. The light-mode
// runner is darkened from github-light's orange (#e36209, 3.5:1 on the card) to
// #b34700 (5.5:1) for AA.
export const tone = {
  runner: "text-[#b34700] dark:text-[#ffab70]",
  flag: "text-[#6f42c1] dark:text-[#b392f0]",
  keyword: "text-[#005cc5] dark:text-[#79b8ff]",
  namespace: "text-muted-foreground",
  item: "text-[#032f62] dark:text-[#9ecbff]",
} as const;

export type TokenKind = keyof typeof tone | "plain";

// Subcommands get the keyword colour; what follows `add` / `install` is what
// is being installed.
const KEYWORDS = new Set(["dlx", "add", "install"]);
const INSTALLS = new Set(["add", "install"]);

/**
 * Splits a command on spaces into coloured parts:
 * `pnpm dlx shadcn@latest add @reziui/button` → pnpm (runner), dlx (keyword),
 * shadcn@latest (plain), add (keyword), @reziui/ (namespace), button (item).
 * Flags (`--bun`) stay flags wherever they appear. Each part after the first
 * carries its leading space, so the joined text is the command unchanged.
 */
export function tokenizeCommand(command: string): { text: string; kind: TokenKind }[] {
  const tokens: { text: string; kind: TokenKind }[] = [];
  let installing = false;

  command.split(" ").forEach((word, i) => {
    const space = i === 0 ? "" : " ";
    if (i === 0) tokens.push({ text: word, kind: "runner" });
    else if (word.startsWith("--")) tokens.push({ text: space + word, kind: "flag" });
    else if (KEYWORDS.has(word)) {
      tokens.push({ text: space + word, kind: "keyword" });
      installing = INSTALLS.has(word);
    } else if (installing) {
      const scoped = /^(@[^/]+\/)(.+)$/.exec(word);
      if (scoped) {
        tokens.push({ text: space + scoped[1], kind: "namespace" });
        tokens.push({ text: scoped[2], kind: "item" });
      } else tokens.push({ text: space + word, kind: "item" });
    } else tokens.push({ text: space + word, kind: "plain" });
  });
  return tokens;
}

/** A command rendered with `tone` colours; its text content is the command as given. */
export function CommandTokens({ command }: { command: string }) {
  return (
    <>
      {tokenizeCommand(command).map((token, i) =>
        token.kind === "plain" ? (
          <Fragment key={i}>{token.text}</Fragment>
        ) : (
          <span key={i} className={tone[token.kind]}>
            {token.text}
          </span>
        ),
      )}
    </>
  );
}
