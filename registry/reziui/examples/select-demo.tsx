import { Label } from "@/registry/reziui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/reziui/ui/select";

const FRAMEWORKS = ["Next.js", "Remix", "Astro", "Nuxt", "SvelteKit"];

export default function SelectDemo() {
  return (
    <div className="grid w-full max-w-60 gap-1.5">
      <Label htmlFor="framework">Framework</Label>
      <Select>
        <SelectTrigger id="framework">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          {FRAMEWORKS.map((name) => (
            <SelectItem key={name} value={name.toLowerCase()} disabled={name === "SvelteKit"}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
