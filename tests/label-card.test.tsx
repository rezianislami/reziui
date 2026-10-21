import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/reziui/ui/card";
import { Input } from "@/registry/reziui/ui/input";
import { Label } from "@/registry/reziui/ui/label";

describe("Label", () => {
  it("names its input and focuses it on click", async () => {
    render(
      <>
        <Label htmlFor="project">Project name</Label>
        <Input id="project" />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Project name" });
    await userEvent.click(screen.getByText("Project name"));

    expect(input).toHaveFocus();
  });

  it("fades with a disabled peer or group", () => {
    render(<Label>Name</Label>);

    expect(screen.getByText("Name")).toHaveClass("peer-disabled:opacity-50", "group-data-[disabled=true]:opacity-50");
  });
});

describe("small text survives cn() merging", () => {
  // Regression: named sizes like text-caption were dropped by tailwind-merge
  // because it read them as colors, so labels rendered at 16px.
  it("keeps the 13px size next to a color class on Label and CardDescription", () => {
    render(
      <>
        <Label>Name</Label>
        <CardDescription>Desc</CardDescription>
      </>,
    );

    expect(screen.getByText("Name")).toHaveClass("text-[13px]", "text-foreground");
    expect(screen.getByText("Desc")).toHaveClass("text-[13px]", "text-muted-foreground");
  });
});

describe("Card", () => {
  it("renders every part with its slot", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy in one click.</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
    expect(screen.getByText("Create project")).toHaveAttribute("data-slot", "card-title");
    expect(screen.getByText("Deploy in one click.")).toHaveAttribute("data-slot", "card-description");
    expect(screen.getByText("Body")).toHaveAttribute("data-slot", "card-content");
    expect(screen.getByText("Actions")).toHaveAttribute("data-slot", "card-footer");
  });

  it("separates the footer with a hairline and right-aligns actions", () => {
    render(<CardFooter>Actions</CardFooter>);

    expect(screen.getByText("Actions")).toHaveClass("border-t", "justify-end");
  });

  it("merges custom classes on the surface", () => {
    render(<Card data-testid="card" className="max-w-sm" />);

    expect(screen.getByTestId("card")).toHaveClass("max-w-sm", "rounded-[0.75rem]");
  });
});
