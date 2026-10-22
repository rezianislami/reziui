import { Label } from "@/registry/reziui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/reziui/ui/select";

export default function SelectStates() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor="region-invalid">Region</Label>
        <Select>
          <SelectTrigger id="region-invalid" aria-invalid aria-describedby="region-invalid-help">
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sin">Singapore</SelectItem>
            <SelectItem value="jkt">Jakarta</SelectItem>
          </SelectContent>
        </Select>
        <p id="region-invalid-help" className="text-xs text-(--destructive-text)">
          Choose a region to continue.
        </p>
      </div>
      <div className="group grid gap-1.5" data-disabled="true">
        <Label htmlFor="region-disabled">Region</Label>
        <Select defaultValue="jkt" disabled>
          <SelectTrigger id="region-disabled">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jkt">Jakarta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
