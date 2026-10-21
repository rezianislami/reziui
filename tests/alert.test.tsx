import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertDismiss,
  AlertTitle,
  alertVariants,
} from "@/registry/reziui/ui/alert";

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
}

function Dismissible({ onDismiss }: { onDismiss?: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      {open && (
        <Alert data-testid="alert">
          <AlertTitle>Tip</AlertTitle>
          <AlertDismiss
            onDismiss={() => {
              onDismiss?.();
              setOpen(false);
            }}
          />
        </Alert>
      )}
      <button type="button">Next control</button>
    </>
  );
}

describe("Alert", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("renders title and description without a live-region role by default", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Use the CLI.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByTestId("alert");
    expect(alert).toHaveAttribute("data-variant", "default");
    expect(alert).not.toHaveAttribute("role");
    expect(alert).toHaveTextContent("Heads up");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("accepts an explicit role for errors or status updates", () => {
    render(
      <>
        <Alert role="alert">Build failed</Alert>
        <Alert role="status">Saved</Alert>
      </>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Build failed");
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it.each([
    ["info", "bg-(--info-tint)"],
    ["success", "bg-(--success-tint)"],
    ["warning", "bg-(--warning-tint)"],
    ["destructive", "bg-(--destructive-tint)"],
  ] as const)("applies the %s status surface", (variant, expected) => {
    render(
      <Alert variant={variant} data-testid="alert">
        x
      </Alert>,
    );

    expect(screen.getByTestId("alert")).toHaveClass(expected);
  });

  it("colors the status title but keeps the description in foreground", () => {
    const classes = alertVariants({ variant: "destructive" }).split(" ");

    expect(classes).toContain("*:data-[slot=alert-title]:text-(--destructive-text)");
    expect(classes.some((c) => c.includes("alert-description"))).toBe(false);
  });

  it("only adds the icon and action columns when those children exist", () => {
    const classes = alertVariants().split(" ");

    expect(classes).toContain("grid-cols-[0_1fr]");
    expect(classes).toContain("has-[>svg]:grid-cols-[1rem_1fr]");
    expect(classes).toContain("has-[>[data-slot=alert-action]]:grid-cols-[0_1fr_auto]");
  });

  it("renders an action slot in the trailing column with logical spacing", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertAction>
          <button type="button">Update</button>
        </AlertAction>
      </Alert>,
    );

    const action = screen.getByRole("button", { name: "Update" }).parentElement!;
    expect(action).toHaveAttribute("data-slot", "alert-action");
    expect(action).toHaveClass("col-start-3", "self-center", "ms-2");
  });

  describe("AlertDismiss", () => {
    beforeEach(() => mockReducedMotion(false));

    it("has an accessible name and a customisable label", () => {
      render(
        <Alert>
          <AlertDismiss onDismiss={() => {}} label="Hide tip" />
        </Alert>,
      );

      expect(screen.getByRole("button", { name: "Hide tip" })).toHaveAttribute("data-slot", "alert-dismiss");
    });

    it("plays the exit, then calls onDismiss after the transition ends", async () => {
      const onDismiss = vi.fn();
      render(<Dismissible onDismiss={onDismiss} />);
      const alert = screen.getByTestId("alert");

      await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

      expect(alert).toHaveAttribute("data-state", "closed");
      expect(onDismiss).not.toHaveBeenCalled();

      act(() => {
        fireEvent.transitionEnd(alert);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
    });

    it("still dismisses if the transition never fires", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const onDismiss = vi.fn();
      render(<Dismissible onDismiss={onDismiss} />);

      await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(screen.getByRole("button", { name: "Dismiss" }));
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("closes instantly under reduced motion", async () => {
      mockReducedMotion(true);
      const onDismiss = vi.fn();
      render(<Dismissible onDismiss={onDismiss} />);

      await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
    });

    it("skips hidden focusable elements when handing focus on", async () => {
      // Regression: an inactive tab panel (tabindex="0", hidden) was picked and
      // refused focus, leaving focus on <body>.
      mockReducedMotion(true);
      render(
        <>
          <Dismissible />
          <div role="tabpanel" tabIndex={0} hidden data-testid="hidden-panel" />
        </>,
      );
      const panel = screen.getByTestId("hidden-panel");
      panel.checkVisibility = () => false;
      const next = screen.getByRole("button", { name: "Next control" });
      // Put the hidden panel first in document order after the alert.
      next.before(panel);

      await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

      expect(next).toHaveFocus();
    });

    it("moves focus to the next focusable element so keyboard users keep their place", async () => {
      mockReducedMotion(true);
      render(<Dismissible />);

      await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

      expect(screen.getByRole("button", { name: "Next control" })).toHaveFocus();
    });
  });
});
