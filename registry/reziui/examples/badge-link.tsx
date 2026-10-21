import Link from "next/link";
import { Badge } from "@/registry/reziui/ui/badge";

export default function BadgeLink() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge asChild>
        <Link href="/docs/components/button">Button</Link>
      </Badge>
      <Badge asChild variant="info" dot>
        <Link href="/docs/installation">Changelog</Link>
      </Badge>
    </div>
  );
}
