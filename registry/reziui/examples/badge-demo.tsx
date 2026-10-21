import { Badge } from "@/registry/reziui/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="info">Beta</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>
        Ready
      </Badge>
    </div>
  );
}
