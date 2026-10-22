import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/reziui/ui/dialog";

function Profile({ showCloseButton }: { showCloseButton?: boolean }) {
  return (
    <>
      <Dialog>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogContent showCloseButton={showCloseButton}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Changes are visible to your team.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <input aria-label="Name" defaultValue="Rezi" />
          </DialogBody>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <button type="button">Behind</button>
    </>
  );
}

const content = () => document.querySelector('[data-slot="dialog-content"]');

describe("Dialog", () => {
  it("opens a modal dialog named and described by its title and description", async () => {
    render(<Profile />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    const dialog = screen.getByRole("dialog", { name: "Edit profile" });
    expect(dialog).toHaveAccessibleDescription("Changes are visible to your team.");
  });

  it("moves focus inside, traps Tab there and returns focus to the trigger on Escape", async () => {
    render(<Profile />);
    const trigger = screen.getByRole("button", { name: "Edit profile" });

    await userEvent.click(trigger);
    expect(content()).toContainElement(document.activeElement as HTMLElement);
    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      expect(content()).toContainElement(document.activeElement as HTMLElement);
    }

    await userEvent.keyboard("{Escape}");
    expect(content()).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("hides the page behind it from assistive technology while open", async () => {
    render(<Profile />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(screen.queryByRole("button", { name: "Behind" })).toBeNull();
  });

  it("closes from the × and from a DialogClose", async () => {
    render(<Profile />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(content()).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(content()).toBeNull();
  });

  it("can drop the × for confirmations, and the header stops reserving room for it", async () => {
    render(<Profile showCloseButton={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(content()).not.toHaveAttribute("data-close");
    expect(document.querySelector('[data-slot="dialog-header"]')).toHaveClass("group-data-close/dialog:pe-12");
  });

  it("uses the overlay surface at radius 16 and keeps a 16px margin on small screens", async () => {
    render(<Profile />);
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(content()).toHaveClass(
      "rounded-[1rem]",
      "bg-popover",
      "shadow-(--shadow-overlay)",
      "ring",
      "max-w-md",
      "w-[calc(100vw-2rem)]",
      "max-h-[calc(100dvh-2rem)]",
    );
    expect(content()!.className).not.toMatch(/rounded-2xl/);
  });

  it("animates the window and scrim only when motion is allowed", async () => {
    render(<Profile />);
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    const overlay = document.querySelector('[data-slot="dialog-overlay"]')!;

    for (const el of [content()!, overlay]) {
      expect(el.className).toMatch(/motion-safe:data-\[state=open\]:animate-in/);
      expect(el.className).not.toMatch(/(^|\s)(animate-in|animate-out)(\s|$)/);
    }
    expect(content()).toHaveClass("motion-safe:data-[state=open]:zoom-in-96");
  });

  it("lays out like Card: header, body and a tinted footer", async () => {
    render(<Profile />);
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(document.querySelector('[data-slot="dialog-header"]')).toHaveClass("px-5", "pt-5", "gap-1");
    expect(document.querySelector('[data-slot="dialog-body"]')).toHaveClass("p-5");
    expect(document.querySelector('[data-slot="dialog-footer"]')).toHaveClass(
      "border-t",
      "border-(--hairline)",
      "bg-(--surface-elevated)",
      "px-5",
      "py-3.5",
    );
  });
});
