import { Label } from "@/registry/reziui/ui/label";
import { Textarea } from "@/registry/reziui/ui/textarea";

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Tell us about your project" aria-describedby="message-help" />
      <p id="message-help" className="text-xs text-muted-foreground">
        The box grows as you type.
      </p>
    </div>
  );
}
