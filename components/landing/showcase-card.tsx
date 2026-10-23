import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/registry/reziui/ui/badge";

type ShowcaseCardProps = {
  title: string;
  description: string;
  href: string;
  isNew?: boolean;
  className?: string;
  style?: CSSProperties;
  /** A live example; overlays open on click. */
  children: ReactNode;
};

// The preview sits inset 8px on the page background, recessed into the card
// (radius 16 around radius 8, so the corners stay concentric). Only the title
// links to the docs: the preview holds interactive controls, and a link
// wrapping them would be invalid nested interactive content.
export function ShowcaseCard({ title, description, href, isNew, className, style, children }: ShowcaseCardProps) {
  return (
    <article
      className={cn("relative flex flex-col overflow-hidden rounded-[1rem] bg-card ring ring-border ring-inset", className)}
      style={style}
    >
      <div
        data-reveal="preview"
        className="m-2 mb-0 grid h-[222px] place-items-center overflow-hidden rounded-md bg-background p-3"
      >
        {children}
      </div>
      <div className="flex flex-col gap-0.5 px-4 pt-3.5 pb-4">
        <h3 className="flex items-center gap-1.5 text-[15px] leading-normal font-semibold">
          <Link
            href={href}
            className="rounded-sm outline-hidden hover:underline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {title}
          </Link>
          {isNew && (
            <>
              <span className="sr-only">, new</span>
              <Badge size="sm" aria-hidden="true">
                New
              </Badge>
            </>
          )}
        </h3>
        <p className="truncate text-xs leading-[1.625] text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}
