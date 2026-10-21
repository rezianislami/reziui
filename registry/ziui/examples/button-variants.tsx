import { Button } from "@/registry/ziui/ui/button";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Button</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="destructive-secondary">Delete</Button>
      <Button variant="link">Learn more</Button>
    </div>
  );
}
