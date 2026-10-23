import type { ComponentType } from "react";
import registry from "@/registry.json";
import BadgeDemo from "@/registry/reziui/examples/badge-demo";
import ButtonSuccess from "@/registry/reziui/examples/button-success";
import DialogConfirm from "@/registry/reziui/examples/dialog-confirm";
import DropdownMenuDemo from "@/registry/reziui/examples/dropdown-menu-demo";
import KbdPressed from "@/registry/reziui/examples/kbd-pressed";
import RadioGroupDemo from "@/registry/reziui/examples/radio-group-demo";
import SelectDemo from "@/registry/reziui/examples/select-demo";
import SheetDemo from "@/registry/reziui/examples/sheet-demo";
import SwitchDemo from "@/registry/reziui/examples/switch-demo";
import TabsDemo from "@/registry/reziui/examples/tabs-demo";
import TextareaDemo from "@/registry/reziui/examples/textarea-demo";
import TooltipToolbar from "@/registry/reziui/examples/tooltip-toolbar";

export const GITHUB_URL = "https://github.com/rezianislami";

/** Counted from the registry, so the number never goes stale. */
export const componentCount = registry.items.filter((item) => item.type === "registry:ui").length;

export type Showcase = { title: string; slug: string; description: string; Preview: ComponentType };

// Previews are the docs examples themselves, so what people try here is
// exactly what the docs show and the CLI installs. Overlays start closed and
// open on click — opened on load they would take focus from the page.
export const recentlyAdded: Showcase[] = [
  { title: "Sheet", slug: "sheet", description: "Panel that slides in from the start or end edge.", Preview: SheetDemo },
  { title: "Select", slug: "select", description: "Input-styled select with the check at the end.", Preview: SelectDemo },
  { title: "Radio Group", slug: "radio-group", description: "16px radios with a dot that scales in.", Preview: RadioGroupDemo },
  { title: "Textarea", slug: "textarea", description: "Multi-line field that grows as you type.", Preview: TextareaDemo },
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
