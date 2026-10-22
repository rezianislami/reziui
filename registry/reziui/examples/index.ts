import type { ComponentType } from "react";
import AlertActionDemo from "./alert-action";
import AlertDemo from "./alert-demo";
import AlertDismissDemo from "./alert-dismiss";
import BadgeDemo from "./badge-demo";
import BadgeIcons from "./badge-icons";
import BadgeLink from "./badge-link";
import BadgeSizes from "./badge-sizes";
import BadgeVariants from "./badge-variants";
import ButtonDemo from "./button-demo";
import ButtonLoading from "./button-loading";
import ButtonSizes from "./button-sizes";
import ButtonSuccess from "./button-success";
import ButtonVariants from "./button-variants";
import CardDemo from "./card-demo";
import CardStat from "./card-stat";
import CheckboxDemo from "./checkbox-demo";
import CheckboxSelectAll from "./checkbox-select-all";
import CheckboxStates from "./checkbox-states";
import DialogConfirm from "./dialog-confirm";
import DialogDemo from "./dialog-demo";
import DropdownMenuDemo from "./dropdown-menu-demo";
import DropdownMenuOptions from "./dropdown-menu-options";
import InputDemo from "./input-demo";
import InputSearch from "./input-search";
import InputStates from "./input-states";
import KbdDemo from "./kbd-demo";
import KbdPressed from "./kbd-pressed";
import PopoverDemo from "./popover-demo";
import SwitchDemo from "./switch-demo";
import SwitchStates from "./switch-states";
import TabsDemo from "./tabs-demo";
import TabsIcons from "./tabs-icons";
import TooltipDemo from "./tooltip-demo";
import TooltipToolbar from "./tooltip-toolbar";

export type Example = {
  component: ComponentType;
  /** Repo-relative source path, read at build time for the Code tab. */
  file: string;
};

// Static imports instead of next/dynamic: examples are tiny and must render in
// the prerendered HTML, which lazy loading would push behind a client boundary.
export const examples: Record<string, Example> = {
  "button-demo": { component: ButtonDemo, file: "registry/reziui/examples/button-demo.tsx" },
  "button-variants": { component: ButtonVariants, file: "registry/reziui/examples/button-variants.tsx" },
  "button-sizes": { component: ButtonSizes, file: "registry/reziui/examples/button-sizes.tsx" },
  "button-loading": { component: ButtonLoading, file: "registry/reziui/examples/button-loading.tsx" },
  "button-success": { component: ButtonSuccess, file: "registry/reziui/examples/button-success.tsx" },
  "badge-demo": { component: BadgeDemo, file: "registry/reziui/examples/badge-demo.tsx" },
  "badge-variants": { component: BadgeVariants, file: "registry/reziui/examples/badge-variants.tsx" },
  "badge-icons": { component: BadgeIcons, file: "registry/reziui/examples/badge-icons.tsx" },
  "badge-sizes": { component: BadgeSizes, file: "registry/reziui/examples/badge-sizes.tsx" },
  "badge-link": { component: BadgeLink, file: "registry/reziui/examples/badge-link.tsx" },
  "tabs-demo": { component: TabsDemo, file: "registry/reziui/examples/tabs-demo.tsx" },
  "tabs-icons": { component: TabsIcons, file: "registry/reziui/examples/tabs-icons.tsx" },
  "kbd-demo": { component: KbdDemo, file: "registry/reziui/examples/kbd-demo.tsx" },
  "kbd-pressed": { component: KbdPressed, file: "registry/reziui/examples/kbd-pressed.tsx" },
  "alert-demo": { component: AlertDemo, file: "registry/reziui/examples/alert-demo.tsx" },
  "alert-action": { component: AlertActionDemo, file: "registry/reziui/examples/alert-action.tsx" },
  "alert-dismiss": { component: AlertDismissDemo, file: "registry/reziui/examples/alert-dismiss.tsx" },
  "input-demo": { component: InputDemo, file: "registry/reziui/examples/input-demo.tsx" },
  "input-states": { component: InputStates, file: "registry/reziui/examples/input-states.tsx" },
  "input-search": { component: InputSearch, file: "registry/reziui/examples/input-search.tsx" },
  "card-demo": { component: CardDemo, file: "registry/reziui/examples/card-demo.tsx" },
  "card-stat": { component: CardStat, file: "registry/reziui/examples/card-stat.tsx" },
  "checkbox-demo": { component: CheckboxDemo, file: "registry/reziui/examples/checkbox-demo.tsx" },
  "checkbox-select-all": { component: CheckboxSelectAll, file: "registry/reziui/examples/checkbox-select-all.tsx" },
  "checkbox-states": { component: CheckboxStates, file: "registry/reziui/examples/checkbox-states.tsx" },
  "switch-demo": { component: SwitchDemo, file: "registry/reziui/examples/switch-demo.tsx" },
  "switch-states": { component: SwitchStates, file: "registry/reziui/examples/switch-states.tsx" },
  "tooltip-demo": { component: TooltipDemo, file: "registry/reziui/examples/tooltip-demo.tsx" },
  "tooltip-toolbar": { component: TooltipToolbar, file: "registry/reziui/examples/tooltip-toolbar.tsx" },
  "dropdown-menu-demo": { component: DropdownMenuDemo, file: "registry/reziui/examples/dropdown-menu-demo.tsx" },
  "dropdown-menu-options": { component: DropdownMenuOptions, file: "registry/reziui/examples/dropdown-menu-options.tsx" },
  "popover-demo": { component: PopoverDemo, file: "registry/reziui/examples/popover-demo.tsx" },
  "dialog-confirm": { component: DialogConfirm, file: "registry/reziui/examples/dialog-confirm.tsx" },
  "dialog-demo": { component: DialogDemo, file: "registry/reziui/examples/dialog-demo.tsx" },
};
