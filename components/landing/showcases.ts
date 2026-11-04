import type { ComponentType } from "react";
import registry from "@/registry.json";
import BadgeDemo from "@/registry/reziui/examples/badge-demo";
import ButtonSuccess from "@/registry/reziui/examples/button-success";
import CommandDialogDemo from "@/registry/reziui/examples/command-dialog";
import DialogConfirm from "@/registry/reziui/examples/dialog-confirm";
import DropdownMenuDemo from "@/registry/reziui/examples/dropdown-menu-demo";
import KbdPressed from "@/registry/reziui/examples/kbd-pressed";
import ProgressDemo from "@/registry/reziui/examples/progress-demo";
import SkeletonDemo from "@/registry/reziui/examples/skeleton-demo";
import SwitchDemo from "@/registry/reziui/examples/switch-demo";
import TabsDemo from "@/registry/reziui/examples/tabs-demo";
import ToastDemo from "@/registry/reziui/examples/toast-demo";
import TooltipToolbar from "@/registry/reziui/examples/tooltip-toolbar";

/** Counted from the registry, so the number never goes stale. */
export const componentCount = registry.items.filter((item) => item.type === "registry:ui").length;

export type Showcase = { title: string; slug: string; description: string; Preview: ComponentType };

// Previews are the docs examples themselves, so what people try here is
// exactly what the docs show and the CLI installs. Overlays start closed and
// open on click — opened on load they would take focus from the page.
export const recentlyAdded: Showcase[] = [
  { title: "Toast", slug: "toast", description: "Messages that stay when they matter.", Preview: ToastDemo },
  { title: "Command", slug: "command", description: "Searchable actions in a ⌘K palette.", Preview: CommandDialogDemo },
  { title: "Skeleton", slug: "skeleton", description: "Loading blocks with a soft shimmer.", Preview: SkeletonDemo },
  { title: "Progress", slug: "progress", description: "4px bar, with or without a known total.", Preview: ProgressDemo },
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
