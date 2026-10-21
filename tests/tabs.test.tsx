import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";

function renderTabs() {
  return render(
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="team" disabled>
          Team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="analytics">Analytics panel</TabsContent>
      <TabsContent value="team">Team panel</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("shows the default tab as selected with its panel", () => {
    renderTabs();

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("switches panels on click", async () => {
    renderTabs();

    await userEvent.click(screen.getByRole("tab", { name: "Analytics" }));

    expect(screen.getByRole("tab", { name: "Analytics" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Analytics panel");
  });

  it("moves between tabs with arrow keys and skips disabled ones", async () => {
    renderTabs();
    await userEvent.click(screen.getByRole("tab", { name: "Overview" }));

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Analytics" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  it("does not activate a disabled tab on click", async () => {
    renderTabs();

    await userEvent.click(screen.getByRole("tab", { name: "Team" }));

    expect(screen.getByRole("tab", { name: "Team" })).toBeDisabled();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("styles the list as a pill track and the active trigger as raised", () => {
    renderTabs();

    expect(screen.getByRole("tablist")).toHaveClass("rounded-full", "bg-accent");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveClass("data-[state=active]:bg-card");
  });
});
