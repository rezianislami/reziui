import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/reziui/ui/sheet";

function Filters({ side, showCloseButton }: { side?: "start" | "end"; showCloseButton?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger>Filters</SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the project list.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <input aria-label="Search" />
        </SheetBody>
        <SheetFooter>
          <SheetClose>Apply</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const content = () => document.querySelector('[data-slot="sheet-content"]');
const open = () => userEvent.click(screen.getByRole("button", { name: "Filters" }));

describe("Sheet", () => {
  it("opens a modal dialog named and described by its header", async () => {
    render(<Filters />);
    await open();

    expect(screen.getByRole("dialog", { name: "Filters" })).toHaveAccessibleDescription("Narrow the project list.");
  });

  it("traps focus, and Escape returns it to the trigger", async () => {
    render(<Filters />);
    const trigger = screen.getByRole("button", { name: "Filters" });
    await open();

    for (let i = 0; i < 4; i++) {
      await userEvent.tab();
      expect(content()).toContainElement(document.activeElement as HTMLElement);
    }
    await userEvent.keyboard("{Escape}");

    expect(content()).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("defaults to the end edge and uses logical placement and slides for either side", async () => {
    const { unmount } = render(<Filters />);
    await open();
    expect(content()).toHaveAttribute("data-side", "end");
    expect(content()).toHaveClass("end-0", "border-s", "motion-safe:data-[state=open]:slide-in-from-end");
    unmount();

    render(<Filters side="start" />);
    await open();
    expect(content()).toHaveClass("start-0", "border-e", "motion-safe:data-[state=open]:slide-in-from-start");
    expect(content()!.className).not.toMatch(/(^|\s)(left|right)-0|slide-in-from-(left|right)/);
  });

  it("is 320px wide but never more than 85% of the viewport, and full height", async () => {
    render(<Filters />);
    await open();

    expect(content()).toHaveClass("w-80", "max-w-[85vw]", "h-dvh", "bg-popover", "shadow-(--shadow-overlay)");
  });

  it("animates only when motion is allowed: 250ms in, 200ms out", async () => {
    render(<Filters />);
    await open();

    expect(content()).toHaveClass("motion-safe:data-[state=open]:duration-250", "motion-safe:data-[state=closed]:duration-200");
    expect(content()!.className).not.toMatch(/(^|\s)(animate-in|animate-out|slide-in-from-\w+)(\s|$)/);
  });

  it("closes from the × and from a SheetClose; the × can be turned off", async () => {
    const { unmount } = render(<Filters />);
    await open();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(content()).toBeNull();
    await open();
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(content()).toBeNull();
    unmount();

    render(<Filters showCloseButton={false} />);
    await open();
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("lets the body scroll between a fixed header and footer", async () => {
    render(<Filters />);
    await open();

    expect(document.querySelector('[data-slot="sheet-body"]')).toHaveClass("flex-1", "min-h-0", "overflow-y-auto");
    expect(document.querySelector('[data-slot="sheet-footer"]')).toHaveClass("mt-auto", "bg-(--surface-elevated)");
  });
});
