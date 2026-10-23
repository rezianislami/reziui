import type { ComponentType } from "react";
import registry from "@/registry.json";
import AccordionDemo from "@/registry/reziui/examples/accordion-demo";
import AvatarGroupDemo from "@/registry/reziui/examples/avatar-group";
import BadgeDemo from "@/registry/reziui/examples/badge-demo";
import ButtonSuccess from "@/registry/reziui/examples/button-success";
import DialogConfirm from "@/registry/reziui/examples/dialog-confirm";
import DropdownMenuDemo from "@/registry/reziui/examples/dropdown-menu-demo";
import KbdPressed from "@/registry/reziui/examples/kbd-pressed";
import SheetDemo from "@/registry/reziui/examples/sheet-demo";
import SliderDemo from "@/registry/reziui/examples/slider-demo";
import SwitchDemo from "@/registry/reziui/examples/switch-demo";
import TabsDemo from "@/registry/reziui/examples/tabs-demo";
import TooltipToolbar from "@/registry/reziui/examples/tooltip-toolbar";

export const GITHUB_URL = "https://github.com/rezianislami";

/** Counted from the registry, so the number never goes stale. */
export const componentCount = registry.items.filter((item) => item.type === "registry:ui").length;

export type Showcase = { title: string; slug: string; description: string; Preview: ComponentType };

// Previews are the docs examples themselves, so what people try here is
// exactly what the docs show and the CLI installs. Overlays start closed and
// open on click — opened on load they would take focus from the page.
export const recentlyAdded: Showcase[] = [
  { title: "Accordion", slug: "accordion", description: "Hairline list whose panels ease open.", Preview: AccordionDemo },
  { title: "Avatar", slug: "avatar", description: "Photo or initials, alone or in a group.", Preview: AvatarGroupDemo },
  { title: "Slider", slug: "slider", description: "Value or range on a 4px track.", Preview: SliderDemo },
  { title: "Sheet", slug: "sheet", description: "Panel that slides in from the start or end edge.", Preview: SheetDemo },
];

export const everyday: Showcase[] = [
  { title: "Button", slug: "button", description: "Pill button with a success morph.", Preview: ButtonSuccess },
  { title: "Tabs", slug: "tabs", description: "Pill track with a sliding indicator.", Preview: TabsDemo },
  { title: "Switch", slug: "switch", description: "Thumb stretches toward its travel.", Preview: SwitchDemo },
  { title: "Tooltip", slug: "tooltip", description: "Opens instantly between neighbours.", Preview: TooltipToolbar },
  { title: "Dialog", slug: "dialog", description: "Modal laid out like Card.", Preview: DialogConfirm },
  { title: "Dropdown Menu", slug: "dropdown-menu", description: "Actions with checkbox and radio items.", Preview: DropdownMenuDemo },
  { title: "Badge", slug: "badge", description: "Tinted status labels with a pulse.", Preview: BadgeDemo },
  { title: "Kbd", slug: "kbd", description: "Keys that press down with the shortcut.", Preview: KbdPressed },
];
