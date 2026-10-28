import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroHighlight } from "@/components/landing/hero-highlight";

const highlight = () => screen.getByText("already done.");

describe("HeroHighlight", () => {
  it("tints behind the words with the brand blue fading left to right", () => {
    render(<HeroHighlight>already done.</HeroHighlight>);

    expect(highlight()).toHaveClass(
      "before:bg-linear-to-r",
      "before:from-primary/18",
      "before:to-primary/4",
      "dark:before:from-primary/32",
      "dark:before:to-primary/8",
      "before:-z-10",
    );
  });

  it("has no glow line, which the announcement bar already uses on this screen", () => {
    render(<HeroHighlight>already done.</HeroHighlight>);

    expect(highlight().className).not.toMatch(/(^| )(motion-safe:)?after:/);
  });

  it("sweeps in from the left only when motion is allowed", () => {
    render(<HeroHighlight>already done.</HeroHighlight>);

    expect(highlight()).toHaveClass("before:origin-left", "motion-safe:before:animate-highlight-sweep");
    expect(highlight().className).not.toMatch(/(^| )before:animate-/);

    const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
    expect(css).toMatch(/--animate-highlight-sweep: highlight-sweep 500ms cubic-bezier\(0\.2, 0, 0, 1\) 720ms both;/);
    expect(css).not.toMatch(/--animate-highlight-line/);
  });

  it("keeps the words in the headline colour", () => {
    render(<HeroHighlight>already done.</HeroHighlight>);

    expect(highlight().className).not.toMatch(/(^| )text-/);
  });

  it("rounds 8px on phones and 10px from sm", () => {
    render(<HeroHighlight>already done.</HeroHighlight>);

    // rounded-lg is 10px in this theme, not 8px, so phones use rounded-md.
    expect(highlight()).toHaveClass("rounded-md", "sm:rounded-[0.625rem]");
  });
});
