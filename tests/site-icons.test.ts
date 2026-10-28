import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(resolve(process.cwd(), "app", file));

// PNG IHDR: width/height are big-endian uint32s at bytes 16 and 20, the colour
// type is byte 25 (2 = RGB, 6 = RGBA).
const pngSize = (png: Buffer) => [png.readUInt32BE(16), png.readUInt32BE(20)];

describe("site icons", () => {
  it("bundles 16, 32 and 48 px in favicon.ico", () => {
    const ico = read("favicon.ico");
    // ICONDIR: reserved 0, type 1 (icon), image count; then 16-byte entries
    // whose first byte is the width (0 would mean 256).
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2)]).toEqual([0, 1]);
    const count = ico.readUInt16LE(4);
    const widths = Array.from({ length: count }, (_, i) => ico[6 + i * 16]).sort((a, b) => a - b);

    expect(widths).toEqual([16, 32, 48]);
  });

  it("ships a square 512 px icon.png", () => {
    expect(pngSize(read("icon.png"))).toEqual([512, 512]);
  });

  it("ships a 180 px apple-icon.png without transparency", () => {
    const png = read("apple-icon.png");

    expect(pngSize(png)).toEqual([180, 180]);
    // iOS fills transparent pixels with black, so the touch icon must be opaque.
    expect(png[25]).toBe(2);
  });
});
