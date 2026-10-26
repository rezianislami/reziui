import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/registry/reziui/ui/badge";
import { Button } from "@/registry/reziui/ui/button";

/** "A", "A and B", "A, B and C": names in the foreground colour, joiners muted. */
function NameList({ titles }: { titles: string[] }) {
  return titles.map((title, i) => (
    <Fragment key={title}>
      <span className="font-medium text-foreground">{title}</span>
      {i < titles.length - 2 ? ", " : i === titles.length - 2 ? " and " : null}
    </Fragment>
  ));
}

// The bar is lifted with a trace of primary in the middle (--announce-tint)
// and a primary line along its bottom that fades out at both ends: noticeable
// without a filled colour block, which would read as one big button and
// compete with the hero's primary action. Phones get a count instead of the
// list, which would wrap to several lines there.
export function Announcement({ titles }: { titles: string[] }) {
  const one = titles.length === 1;
  return (
    <div
      className={cn(
        "relative flex min-h-10 items-center justify-center gap-2 px-4 py-1.5 text-center text-xs text-muted-foreground sm:gap-3 sm:text-[13px]",
        "bg-linear-to-r from-(--surface-elevated) via-(--announce-tint) to-(--surface-elevated)",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-primary after:to-transparent",
      )}
    >
      <span className="flex items-center gap-2">
        <Badge size="sm">New</Badge>
        <span className="hidden sm:inline">
          <NameList titles={titles} />
          {one ? " is here" : " are here"}
        </span>
        <span className="sm:hidden">
          {titles.length} new {one ? "component" : "components"}
        </span>
      </span>
      <Button asChild variant="secondary" size="sm">
        <a href="#new">See what&apos;s new →</a>
      </Button>
    </div>
  );
}
