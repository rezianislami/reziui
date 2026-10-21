import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/components/docs/copy-button";

describe("CopyButton", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // userEvent.setup() installs its own clipboard stub, so override after it.
    writeText = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function setup(ui: React.ReactElement) {
    // advanceTimers is only valid while fake timers are installed.
    const user = userEvent.setup(vi.isFakeTimers() ? { advanceTimers: vi.advanceTimersByTime } : {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(ui);
    return user;
  }

  it("copies a string value and flags the copied state", async () => {
    const user = setup(<CopyButton value="npx shadcn add @ziui/button" aria-label="Copy" />);

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("npx shadcn add @ziui/button");
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAttribute("data-copied", "true");
  });

  it("reads the value lazily when given a getter", async () => {
    let text = "first";
    const user = setup(<CopyButton value={() => text} aria-label="Copy" />);
    text = "second";

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("second");
  });

  it("resets the copied state after a short delay", async () => {
    // shouldAdvanceTime keeps userEvent's internal awaits moving under fake timers.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = setup(<CopyButton value="x" aria-label="Copy" />);

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByRole("button")).toHaveAttribute("data-copied", "true");

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByRole("button")).not.toHaveAttribute("data-copied");
  });

  it("stays in the idle state when the clipboard rejects", async () => {
    writeText.mockRejectedValueOnce(new DOMException("denied", "NotAllowedError"));
    const user = setup(<CopyButton value="x" aria-label="Copy" />);

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(screen.getByRole("button")).not.toHaveAttribute("data-copied");
  });

  it("renders a labelled small button when given children", () => {
    setup(<CopyButton value="x">Copy page</CopyButton>);

    const button = screen.getByRole("button", { name: "Copy page" });
    expect(button).toHaveAttribute("data-size", "sm");
  });
});
