import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "@/registry/reziui/ui/badge";

export default function BadgeIcons() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="success" dot>
          Ready
        </Badge>
        <Badge variant="warning" pulse>
          Building
        </Badge>
        <Badge variant="destructive" dot>
          Failed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="success">
          <CircleCheckIcon />
          Ready
        </Badge>
        <Badge variant="warning">
          <TriangleAlertIcon />
          Building
        </Badge>
        <Badge variant="info">
          <InfoIcon />
          Queued
        </Badge>
        <Badge variant="destructive">
          <CircleXIcon />
          Failed
        </Badge>
      </div>
    </div>
  );
}
