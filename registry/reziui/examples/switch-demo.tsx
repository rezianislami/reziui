import { Label } from "@/registry/reziui/ui/label";
import { Switch } from "@/registry/reziui/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" defaultChecked />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  );
}
