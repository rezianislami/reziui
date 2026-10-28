import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DELAY, ENTER, ENTER_TOP } from "@/lib/motion";

const ms = (classes: string, utility: "duration" | "delay") =>
  Number(classes.match(new RegExp(`motion-safe:${utility}-(\\d+)`))?.[1] ?? 0);

describe("page entrance", () => {
  it("brings blocks up out of a soft blur", () => {
    expect(ENTER.split(" ")).toEqual(
      expect.arrayContaining(["motion-safe:fade-in", "motion-safe:blur-in-sm", "motion-safe:slide-in-from-bottom-2"]),
    );
    expect(ENTER_TOP.split(" ")).toEqual(
      expect.arrayContaining(["motion-safe:fade-in", "motion-safe:blur-in-sm", "motion-safe:slide-in-from-top-2"]),
    );
  });

  it("stays completely still under reduced motion", () => {
    for (const classes of [ENTER, ENTER_TOP, ...DELAY]) {
      for (const c of classes.split(" ").filter(Boolean)) expect(c, c).toMatch(/^motion-safe:/);
    }
  });

  it("releases the animation once it has played", () => {
    // A "both" fill would leave a filter/transform applied for good, making
    // the block a containing block for fixed children and a backdrop root.
    for (const classes of [ENTER, ENTER_TOP]) {
      expect(classes).toContain("motion-safe:fill-mode-backwards");
      expect(classes).not.toContain("fill-mode-both");
    }
  });

  it("staggers steps 60ms apart", () => {
    const delays = DELAY.map((step) => ms(step, "delay"));

    expect(delays).toEqual(delays.map((_, i) => i * 60));
  });

  it("starts the highlight sweep as headline line 2 lands", () => {
    // Line 2 of the hero headline is the third step (DELAY[2]).
    const landed = ms(DELAY[2], "delay") + ms(ENTER, "duration");
    const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
    const sweepDelay = Number(css.match(/--animate-highlight-sweep: highlight-sweep \d+ms [^;]*? (\d+)ms both;/)?.[1]);

    expect(sweepDelay).toBe(landed);
  });
});
