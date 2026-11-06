import type { ComponentType, SVGProps } from "react";
import { ArrowRightLeftIcon, KeyboardIcon, MoonIcon, PauseIcon } from "lucide-react";

type Principle = { title: string; description: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

// Only claims the registry backs today: focus-ring and motion-safe classes are
// asserted in the component tests, the theme test pairs every light token with
// a dark one, and keyboard behaviour comes from the Radix primitives.
// Right-to-left holds for every component: each example was rendered under
// <html dir="rtl"> with Radix's Direction.Provider, overlays opened, and arrow
// keys checked in Tabs and Radio Group. Add a card here only when the whole
// registry meets it.
export const principles: Principle[] = [
  {
    title: "Keyboard & focus",
    description: "Arrow keys, Escape, and a visible ring on every control you reach.",
    Icon: KeyboardIcon,
  },
  { title: "Reduced motion", description: "Animations step aside when the system asks for less motion.", Icon: PauseIcon },
  { title: "Dark mode", description: "Every token has a dark value, with contrast checked in both.", Icon: MoonIcon },
  { title: "Right-to-left", description: "Logical spacing, with icons and slides that mirror.", Icon: ArrowRightLeftIcon },
];

// Four cards in the same shell as the component cards below (16px radius,
// inset ring, card surface) but text only, so the section stays light and the
// previews below remain the visual focus. The grid stretches every card in a
// row to the tallest one. Icons stay in the foreground colour, not the brand
// blue, which in Rezi UI marks something you can click.
export function Principles() {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {principles.map(({ title, description, Icon }) => (
        <li key={title} className="flex flex-col gap-3 rounded-[1rem] bg-card p-5 ring ring-border ring-inset">
          <Icon className="size-5 text-foreground" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <p className="text-[13px] leading-5 text-pretty text-muted-foreground">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
