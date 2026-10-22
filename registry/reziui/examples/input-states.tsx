import { Input } from "@/registry/reziui/ui/input";
import { Label } from "@/registry/reziui/ui/label";

export default function InputStates() {
  return (
    <div className="grid w-full max-w-2xl items-start gap-6 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor="name-invalid">Project name</Label>
        <Input id="name-invalid" defaultValue="Rezi UI Docs" aria-invalid aria-describedby="name-invalid-help" />
        <p id="name-invalid-help" className="text-xs text-(--destructive-text)">
          Use only lowercase letters.
        </p>
      </div>
      <div className="group grid gap-1.5" data-disabled="true">
        <Label htmlFor="name-disabled">Project name</Label>
        <Input id="name-disabled" placeholder="my-project" disabled />
      </div>
    </div>
  );
}
