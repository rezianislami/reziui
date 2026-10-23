import { Label } from "@/registry/reziui/ui/label";
import { Progress } from "@/registry/reziui/ui/progress";

export default function ProgressIndeterminate() {
  return (
    <div className="grid w-full max-w-70 gap-2.5">
      <Label id="sync-label">Syncing projects…</Label>
      <Progress aria-labelledby="sync-label" />
    </div>
  );
}
