import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Avatar,
  AvatarFallback,
  avatarGradient,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/reziui/ui/avatar";

// jsdom never loads images, so Radix would keep showing the fallback. This
// stand-in fires load (or error) as soon as a src is set, like a real browser.
function stubImage(outcome: "load" | "error") {
  vi.stubGlobal(
    "Image",
    class {
      complete = false;
      naturalWidth = 0;
      listeners: Record<string, (event: { currentTarget: unknown }) => void> = {};
      addEventListener(type: string, cb: (event: { currentTarget: unknown }) => void) {
        this.listeners[type] = cb;
      }
      removeEventListener(type: string) {
        delete this.listeners[type];
      }
      set src(_: string) {
        setTimeout(() => {
          this.complete = true;
          this.naturalWidth = outcome === "load" ? 1 : 0;
          this.listeners[outcome]?.({ currentTarget: this });
        });
      }
    },
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("Avatar", () => {
  it("shows the initials when there is no photo", () => {
    render(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("AL")).toHaveClass("bg-accent", "ring", "ring-border", "ring-inset");
  });

  it("swaps the initials for the photo once it loads", async () => {
    stubImage("load");
    render(
      <Avatar>
        <AvatarImage src="/ana.jpg" alt="Ana Lima" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>,
    );

    const img = await screen.findByRole("img", { name: "Ana Lima" });
    expect(img).toHaveClass("outline-black/10", "dark:outline-white/10", "-outline-offset-1");
    expect(screen.queryByText("AL")).not.toBeInTheDocument();
  });

  it("keeps the initials when the photo fails", async () => {
    stubImage("error");
    render(
      <Avatar>
        <AvatarImage src="/missing.jpg" alt="Ana Lima" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>,
    );

    await act(() => new Promise((r) => setTimeout(r, 10)));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("puts the initials on a gradient picked by the seed", () => {
    render(
      <Avatar>
        <AvatarFallback seed="alya@example.com">AL</AvatarFallback>
      </Avatar>,
    );
    const fallback = screen.getByText("AL");

    expect(fallback).toHaveAttribute("data-gradient", avatarGradient("alya@example.com"));
    expect(fallback).toHaveClass("bg-linear-135", "ring-inset");
    expect(fallback).not.toHaveClass("bg-accent");
    // Text colour and both stops survive class merging, in light and dark.
    expect(fallback.className).toMatch(/ text-\[oklch\(0\.36_/);
    expect(fallback.className).toMatch(/ from-\[oklch\(0\.92_/);
    expect(fallback.className).toMatch(/ dark:to-\[oklch\(0\.32_/);
    expect(fallback.className).toMatch(/ dark:text-\[oklch\(0\.93_/);
  });

  it("maps a seed to the same gradient every time and uses all six", () => {
    expect(avatarGradient("alya@example.com")).toBe(avatarGradient("alya@example.com"));
    expect(avatarGradient("")).toBe(avatarGradient(""));

    const seen = new Set(Array.from({ length: 200 }, (_, i) => avatarGradient(`user${i}@example.com`)));
    expect([...seen].sort()).toEqual(["lime", "orchid", "peach", "rose", "teal", "violet"]);
  });

  it("separates near-identical seeds", () => {
    const picks = new Set(["ana@a.com", "ana@b.com", "ana@c.com", "ana@d.com"].map(avatarGradient));
    expect(picks.size).toBeGreaterThan(1);
  });

  it("stays neutral without a seed", () => {
    render(
      <Avatar>
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("MK")).not.toHaveAttribute("data-gradient");
    expect(screen.getByText("MK")).toHaveClass("bg-accent", "text-accent-foreground");
  });

  it("sizes the circle and its initials together", () => {
    const { container } = render(
      <>
        <Avatar size="sm" />
        <Avatar />
        <Avatar size="lg" />
      </>,
    );
    const [sm, md, lg] = container.querySelectorAll('[data-slot="avatar"]');

    expect(sm).toHaveClass("size-6", "text-[10px]", "rounded-full");
    expect(md).toHaveClass("size-8", "text-xs");
    expect(md).toHaveAttribute("data-size", "default");
    expect(lg).toHaveClass("size-10", "text-sm");
  });

  it("overlaps a group with a separating ring and counts the rest", () => {
    render(
      <AvatarGroup role="group" aria-label="Members">
        <Avatar>
          <AvatarFallback>RZ</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          +3<span className="sr-only"> more people</span>
        </AvatarGroupCount>
      </AvatarGroup>,
    );

    const group = screen.getByRole("group", { name: "Members" });
    expect(group).toHaveClass("-space-x-1", "*:data-[slot=avatar]:ring-2", "*:data-[slot=avatar]:ring-background");
    const count = screen.getByText("+3", { exact: false });
    expect(count).toHaveTextContent("+3 more people");
    // The count is a ring target too, so its own 1px edge must not be a ring.
    expect(count).toHaveAttribute("data-slot", "avatar");
    expect(count).toHaveClass("outline-1", "-outline-offset-1");
    expect(count).not.toHaveClass("ring-inset");
  });
});
