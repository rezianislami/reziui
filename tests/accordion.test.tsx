import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/reziui/ui/accordion";

function Faq({ type = "single" as "single" | "multiple", onValueChange = () => {}, disabledLast = false }) {
  const items = (
    <>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First answer</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second answer</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c" disabled={disabledLast}>
        <AccordionTrigger>Third</AccordionTrigger>
        <AccordionContent>Third answer</AccordionContent>
      </AccordionItem>
    </>
  );
  return type === "single" ? (
    <Accordion type="single" collapsible onValueChange={onValueChange}>
      {items}
    </Accordion>
  ) : (
    <Accordion type="multiple">{items}</Accordion>
  );
}

const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
  it("renders closed triggers whose panels are labelled by them", async () => {
    render(<Faq />);

    expect(trigger("First")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("First answer")).not.toBeInTheDocument();

    await userEvent.click(trigger("First"));
    expect(trigger("First")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "First" })).toHaveTextContent("First answer");
  });

  it("keeps one item open with type single, and lets it close when collapsible", async () => {
    const onValueChange = vi.fn();
    render(<Faq onValueChange={onValueChange} />);

    await userEvent.click(trigger("First"));
    await userEvent.click(trigger("Second"));
    expect(trigger("First")).toHaveAttribute("aria-expanded", "false");
    expect(trigger("Second")).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(trigger("Second"));
    expect(trigger("Second")).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("lets several stay open with type multiple", async () => {
    render(<Faq type="multiple" />);

    await userEvent.click(trigger("First"));
    await userEvent.click(trigger("Second"));

    expect(trigger("First")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Second")).toHaveAttribute("aria-expanded", "true");
  });

  it("moves between triggers with arrow keys, Home and End, skipping disabled items", async () => {
    render(<Faq disabledLast />);

    await userEvent.tab();
    expect(trigger("First")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(trigger("Second")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(trigger("First")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(trigger("Second")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(trigger("Second")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Third")).toBeDisabled();
  });

  it("styles the row, the outside focus ring and the motion-gated panel", async () => {
    render(<Faq />);
    await userEvent.click(trigger("First"));
    const content = document.querySelector('[data-slot="accordion-content"]')!;

    expect(trigger("First")).toHaveClass("py-4", "text-sm", "font-medium", "after:-inset-x-1", "after:inset-y-1", "focus-visible:after:outline-2");
    expect(trigger("First").querySelector("svg")).toHaveClass(
      "group-data-[state=open]/trigger:rotate-180",
      "group-hover/trigger:text-foreground",
    );
    expect(document.querySelector('[data-slot="accordion-item"]')).toHaveClass("border-b", "border-(--hairline)");
    expect(content).toHaveClass(
      "overflow-hidden",
      "motion-safe:data-[state=open]:animate-accordion-down",
      "motion-safe:data-[state=open]:duration-200",
      "motion-safe:data-[state=closed]:duration-150",
    );
    expect(content.firstElementChild).toHaveClass("pb-4");
  });
});
