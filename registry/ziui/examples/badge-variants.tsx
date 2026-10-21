import { Badge } from "@/registry/ziui/ui/badge";

export default function BadgeVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="info">Beta</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  );
}
