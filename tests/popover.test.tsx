import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/reziui/ui/popover";

function Share() {
  return (
    <>
      <Popover>
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent>
          <label>
            Link
            <input defaultValue="rezi.dev/s/k3J9" />
          </label>
        </PopoverContent>
      </Popover>
      <button type="button">Outside</button>
    </>
  );
}

const content = () => document.querySelector('[data-slot="popover-content"]');

describe("Popover", () => {
  it("opens on click as a dialog wired to its trigger", async () => {
    render(<Share />);
    const trigger = screen.getByRole("button", { name: "Share" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toHaveAttribute("id", trigger.getAttribute("aria-controls"));
  });

  it("moves focus inside and returns it to the trigger on Escape", async () => {
    render(<Share />);
    const trigger = screen.getByRole("button", { name: "Share" });

    await userEvent.click(trigger);
    expect(content()).toContainElement(document.activeElement as HTMLElement);

    await userEvent.keyboard("{Escape}");
    expect(content()).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes on an outside click", async () => {
    render(<Share />);

    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));

    expect(content()).toBeNull();
  });

  it("sits 6px from the trigger on the overlay surface", async () => {
    render(<Share />);
    await userEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(content()).toHaveClass(
      "w-72",
      "p-4",
      "rounded-[0.75rem]",
      "bg-popover",
      "shadow-(--shadow-overlay)",
      "ring",
      "ring-border",
    );
  });

  it("animates only when motion is allowed", async () => {
    render(<Share />);
    await userEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(content()).toHaveClass("motion-safe:data-[state=open]:animate-in", "motion-safe:data-[state=closed]:animate-out");
    expect(content()!.className).not.toMatch(/(^|\s)(animate-in|animate-out)(\s|$)/);
  });
});
