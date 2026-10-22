import { Label } from "@/registry/reziui/ui/label";
import { Switch } from "@/registry/reziui/ui/switch";

const STATES = [
  { id: "switch-off", label: "Off" },
  { id: "switch-on", label: "On", checked: true },
  { id: "switch-disabled", label: "Disabled", disabled: true },
  { id: "switch-disabled-on", label: "Disabled on", checked: true, disabled: true },
];

export default function SwitchStates() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {STATES.map(({ id, label, checked, disabled }) => (
        <div key={id} className="flex items-center gap-2">
          <Switch id={id} defaultChecked={checked} disabled={disabled} />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  );
}
