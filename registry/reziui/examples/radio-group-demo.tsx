import { Label } from "@/registry/reziui/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/reziui/ui/radio-group";

const PLANS = [
  { value: "free", label: "Free", description: "Up to 3 projects." },
  { value: "pro", label: "Pro", description: "Unlimited projects and custom domains." },
  { value: "team", label: "Team", description: "Shared workspaces and roles." },
];

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="pro" aria-label="Plan">
      {PLANS.map(({ value, label, description }) => (
        <div key={value} className="flex items-start gap-2">
          <RadioGroupItem id={`plan-${value}`} value={value} aria-describedby={`plan-${value}-description`} className="mt-0.5" />
          <div className="grid gap-0.5">
            <Label htmlFor={`plan-${value}`}>{label}</Label>
            <p id={`plan-${value}-description`} className="text-[13px] leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
