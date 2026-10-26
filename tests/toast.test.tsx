import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast as sonnerToast } from "sonner";
import { toast, Toaster } from "@/registry/reziui/ui/toast";

const region = () => screen.getByRole("region", { name: /Notifications/ });
const item = (title: string) => screen.getByText(title).closest("[data-sonner-toast]") as HTMLElement;

afterEach(() => {
  act(() => {
    sonnerToast.dismiss();
  });
  vi.useRealTimers();
});

describe("Toaster", () => {
  it("renders a labelled region at the top centre with the page font", async () => {
    render(<Toaster />);
    act(() => {
      toast("Event created");
    });

    const list = await vi.waitFor(() => {
      const el = region().querySelector<HTMLElement>("[data-sonner-toaster]");
      if (!el) throw new Error("toaster list not rendered yet");
      return el;
    });
    expect(list).toHaveAttribute("data-y-position", "top");
    expect(list).toHaveAttribute("data-x-position", "center");
    expect(list.style.fontFamily).toBe("inherit");
    // Sonner declares status variables with the theme tokens' names; the
    // toaster hands the page's values back so the icons use Rezi UI's colours.
    for (const name of ["--success-text", "--warning-text", "--info-text"]) {
      expect(list.style.getPropertyValue(name)).toBe("inherit");
    }
  });

  it("styles each toast on the overlay surface with a close button", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Changes saved", { description: "Your profile is up to date." });
    });

    const t = await vi.waitFor(() => item("Changes saved"));
    expect(t).toHaveAttribute("data-type", "success");
    expect(t).toHaveClass("bg-popover", "shadow-(--shadow-overlay)", "ring-border", "rounded-[0.75rem]", "w-full");
    expect(within(t).getByText("Your profile is up to date.")).toHaveClass("text-muted-foreground");
    expect(within(t).getByRole("button", { name: "Close toast" })).toBeInTheDocument();
  });

  it("colours only the icon by type", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Upload failed");
    });

    const t = await vi.waitFor(() => item("Upload failed"));
    expect(t.className).toMatch(/data-\[type=error\]:\[&_\[data-icon\]\]:text-\(--destructive-text\)/);
    expect(t.querySelector("[data-icon] svg")).toHaveAttribute("aria-hidden", "true");
    expect(within(t).getByText("Upload failed")).toHaveClass("text-foreground");
  });

  it("runs an action from its button", async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.error("Upload failed", { action: { label: "Retry", onClick } });
    });

    await userEvent.click(await screen.findByRole("button", { name: "Retry" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("toast timing", () => {
  const spy = (method: "error" | "success" | "info" | "warning" | "message") => vi.spyOn(sonnerToast, method);

  it("keeps errors until they are closed", () => {
    const error = spy("error");
    toast.error("Upload failed");
    expect(error).toHaveBeenCalledWith("Upload failed", expect.objectContaining({ duration: Infinity }));
    error.mockRestore();
  });

  it("keeps any toast with an action until it is closed", () => {
    const success = spy("success");
    const action = { label: "Undo", onClick: () => {} };
    toast.success("Archived", { action });
    expect(success).toHaveBeenCalledWith("Archived", expect.objectContaining({ duration: Infinity, action }));
    success.mockRestore();
  });

  it("leaves plain toasts on Sonner's default timer", () => {
    const info = spy("info");
    toast.info("Saved");
    expect(info).toHaveBeenCalledWith("Saved", undefined);
    info.mockRestore();
  });

  it("lets an explicit duration win", () => {
    const error = spy("error");
    toast.error("Upload failed", { duration: 8000 });
    expect(error).toHaveBeenCalledWith("Upload failed", expect.objectContaining({ duration: 8000 }));
    error.mockRestore();
  });

  it("keeps the rest of Sonner's API", () => {
    expect(toast.promise).toBe(sonnerToast.promise);
    expect(toast.dismiss).toBe(sonnerToast.dismiss);
    expect(toast.loading).toBe(sonnerToast.loading);
  });
});
