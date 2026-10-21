import { Badge } from "@/registry/ziui/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>
        Ready
      </Badge>
    </div>
  );
}
