import { MenuIcon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/reziui/ui/sheet";

const LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "Components", href: "#components", current: true },
  { label: "Changelog", href: "#changelog" },
];

export default function SheetNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="start" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Rezi UI</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <nav aria-label="Main" className="grid gap-0.5">
            {LINKS.map(({ label, href, current }) => (
              <a
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
                className="flex h-10 items-center rounded-md px-3 text-[15px] text-muted-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-ring aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
