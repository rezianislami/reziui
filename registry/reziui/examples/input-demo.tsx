import { Input } from "@/registry/reziui/ui/input";
import { Label } from "@/registry/reziui/ui/label";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="project-name">Project name</Label>
      <Input id="project-name" placeholder="my-project" />
    </div>
  );
}
