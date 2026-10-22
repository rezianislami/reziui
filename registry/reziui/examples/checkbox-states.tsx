import { Checkbox } from "@/registry/reziui/ui/checkbox";
import { Label } from "@/registry/reziui/ui/label";

const STATES = [
  { id: "checkbox-unchecked", label: "Unchecked" },
  { id: "checkbox-checked", label: "Checked", checked: true },
  { id: "checkbox-indeterminate", label: "Indeterminate", checked: "indeterminate" as const },
  { id: "checkbox-disabled", label: "Disabled", disabled: true },
  { id: "checkbox-invalid", label: "Invalid", invalid: true },
];

export default function CheckboxStates() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {STATES.map(({ id, label, checked, disabled, invalid }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox id={id} defaultChecked={checked} disabled={disabled} aria-invalid={invalid} />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  );
}
