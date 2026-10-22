import { Checkbox } from "@/registry/reziui/ui/checkbox";
import { Label } from "@/registry/reziui/ui/label";

export default function CheckboxDemo() {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id="terms" defaultChecked aria-describedby="terms-description" className="mt-0.5" />
      <div className="grid gap-0.5">
        <Label htmlFor="terms">Accept terms and conditions</Label>
        <p id="terms-description" className="text-[13px] leading-5 text-muted-foreground">
          You agree to the Terms of Service.
        </p>
      </div>
    </div>
  );
}
