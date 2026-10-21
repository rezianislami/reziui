import { Button } from "@/registry/ziui/ui/button";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="secondary" size="xs">
        Extra small
      </Button>
      <Button variant="secondary" size="sm">
        Small
      </Button>
      <Button variant="secondary">Default</Button>
      <Button variant="secondary" size="lg">
        Large
      </Button>
    </div>
  );
}
