import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CardStat from "@/registry/reziui/examples/card-stat";
import InputStates from "@/registry/reziui/examples/input-states";
import SelectStates from "@/registry/reziui/examples/select-states";

// Regression: in a two-column row of fields where one has an error message,
// the grid stretched the other field to the same height and spread the spare
// height over its label and control rows, pushing both down out of line.
describe("side-by-side field examples", () => {
  it.each([
    ["input-states", InputStates],
    ["select-states", SelectStates],
  ])("%s keeps each field only as tall as its content", (_, Example) => {
    const { container } = render(<Example />);

    expect(container.firstElementChild).toHaveClass("sm:grid-cols-2", "items-start");
  });
});

// Regression: a signed number has no strong-direction characters, so in a
// right-to-left page the bidi algorithm moved the sign to the end ("12.4%+").
describe("card-stat example", () => {
  it("keeps the signed change readable in right-to-left layouts", () => {
    const { getByText } = render(<CardStat />);

    expect(getByText("+12.4%")).toHaveAttribute("dir", "ltr");
  });
});
