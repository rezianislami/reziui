import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/reziui/ui/tooltip";

afterEach(() => {
  vi.useRealTimers();
});

function Copy({ label = "Copy" }: { label?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>{label}</TooltipTrigger>
      <TooltipContent>{`${label} to clipboard`}</TooltipContent>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("works without a provider and shows on keyboard focus", async () => {
    render(<Copy />);

    await userEvent.tab();

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy to clipboard");
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAttribute("aria-describedby");
  });

  it("closes on Escape", async () => {
    render(<Copy />);
    await userEvent.tab();
    await screen.findByRole("tooltip");

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("waits 400ms before opening on hover", () => {
    vi.useFakeTimers();
    render(<Copy />);
    const trigger = screen.getByRole("button", { name: "Copy" });

    fireEvent.pointerMove(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(399));
    expect(screen.queryByRole("tooltip")).toBeNull();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("opens the next tooltip in a shared provider instantly, without the entrance", () => {
    vi.useFakeTimers();
    render(
      <TooltipProvider>
        <Copy label="Bold" />
        <Copy label="Italic" />
      </TooltipProvider>,
    );
    const [bold, italic] = screen.getAllByRole("button");

    fireEvent.pointerMove(bold, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(400));
    expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveAttribute("data-state", "delayed-open");

    // Leaving a trigger starts Radix's grace period toward the content; a
    // pointer move elsewhere on the page ends it, as on a real page.
    fireEvent.pointerLeave(bold, { pointerType: "mouse", clientX: 0, clientY: 0 });
    fireEvent.pointerMove(document, { pointerType: "mouse", clientX: 999, clientY: 999 });
    fireEvent.pointerMove(italic, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(0));

    const states = [...document.querySelectorAll('[data-slot="tooltip-content"]')].map(
      (el) => `${el.textContent}:${el.getAttribute("data-state")}`,
    );
    expect(states).toContain("Italic to clipboard:instant-open");
  });

  it("animates only the delayed entrance and only when motion is allowed", async () => {
    render(<Copy />);
    await userEvent.tab();
    const content = document.querySelector('[data-slot="tooltip-content"]')!;

    expect(content).toHaveClass("motion-safe:data-[state=delayed-open]:animate-in", "motion-safe:data-[state=closed]:animate-out");
    expect(content.className).not.toMatch(/(^|\s)(animate-in|animate-out|data-\[state=instant-open\]:animate-in)/);
  });

  it("is an inverted 24px chip that wraps at 240px", async () => {
    render(<Copy />);
    await userEvent.tab();

    expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveClass(
      "bg-foreground",
      "text-background",
      "text-xs",
      "px-2",
      "py-1",
      "max-w-60",
    );
  });
});
