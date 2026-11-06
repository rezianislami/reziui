import { Badge } from "@/registry/reziui/ui/badge";
import { Card, CardContent } from "@/registry/reziui/ui/card";

export default function CardStat() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="grid gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">Requests · 24h</span>
          {/* dir="ltr": a signed number has no strong-direction characters,
              so right-to-left pages would otherwise render it as "12.4%+". */}
          <Badge variant="success" dir="ltr">
            +12.4%
          </Badge>
        </div>
        <span className="text-3xl font-semibold tracking-tight">1,284,031</span>
        <span className="text-xs text-muted-foreground">vs 1,142,557 the previous day</span>
      </CardContent>
    </Card>
  );
}
