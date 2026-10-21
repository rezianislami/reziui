import { Badge } from "@/registry/ziui/ui/badge";

export default function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="outline" size="sm" className="font-mono">
        v1.4.0
      </Badge>
      <Badge variant="outline">Default</Badge>
    </div>
  );
}
