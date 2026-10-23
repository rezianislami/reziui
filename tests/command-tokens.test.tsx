import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommandTokens, tokenizeCommand, tone } from "@/components/docs/command-tokens";

const kinds = (command: string) => tokenizeCommand(command).map((t) => [t.text, t.kind]);

describe("tokenizeCommand", () => {
  it("colours each part of a shadcn add", () => {
    expect(kinds("npx shadcn@latest add @reziui/button")).toEqual([
      ["npx", "runner"],
      [" shadcn@latest", "plain"],
      [" add", "keyword"],
      [" @reziui/", "namespace"],
      ["button", "item"],
    ]);
  });

  it("treats dlx as a subcommand and --bun as a flag", () => {
    expect(kinds("pnpm dlx shadcn@latest")).toEqual([
      ["pnpm", "runner"],
      [" dlx", "keyword"],
      [" shadcn@latest", "plain"],
    ]);
    expect(kinds("bunx --bun shadcn@latest")[1]).toEqual([" --bun", "flag"]);
  });

  it("marks every package after install, splitting scopes", () => {
    expect(kinds("npm install radix-ui @radix-ui/react-slot")).toEqual([
      ["npm", "runner"],
      [" install", "keyword"],
      [" radix-ui", "item"],
      [" @radix-ui/", "namespace"],
      ["react-slot", "item"],
    ]);
  });

  it("leaves words before any install subcommand plain", () => {
    expect(kinds("npx shadcn@latest init")).toEqual([
      ["npx", "runner"],
      [" shadcn@latest", "plain"],
      [" init", "plain"],
    ]);
  });

  it("joins back to the command unchanged", () => {
    for (const command of ["bunx --bun shadcn@latest add @reziui/dialog", "npm install radix-ui lucide-react", "yarn"]) {
      expect(tokenizeCommand(command).map((t) => t.text).join("")).toBe(command);
    }
  });
});

describe("CommandTokens", () => {
  it("renders the command text with the tone classes", () => {
    const { container } = render(<CommandTokens command="npm install radix-ui" />);

    expect(container.textContent).toBe("npm install radix-ui");
    expect(container.querySelector("span")).toHaveClass(...tone.runner.split(" "));
    expect([...container.querySelectorAll("span")].map((s) => s.className)).toEqual([
      tone.runner,
      tone.keyword,
      tone.item,
    ]);
  });
});
