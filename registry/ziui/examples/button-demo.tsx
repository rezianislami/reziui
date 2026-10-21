import { PlusIcon } from "lucide-react";
import { Button } from "@/registry/ziui/ui/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="secondary" size="icon" aria-label="Add item">
        <PlusIcon />
      </Button>
    </div>
  );
}
