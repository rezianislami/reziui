import { Label } from "@/registry/reziui/ui/label";
import { Progress } from "@/registry/reziui/ui/progress";

export default function ProgressDemo() {
  return (
    <div className="grid w-full max-w-70 gap-2.5">
      <div className="flex items-center justify-between">
        <Label id="upload-label">Uploading report.pdf</Label>
        <span aria-hidden="true" className="text-[13px] text-muted-foreground tabular-nums">
          64%
        </span>
      </div>
      <Progress value={64} aria-labelledby="upload-label" />
    </div>
  );
}
