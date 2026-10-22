import { CopyIcon, Share2Icon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import { Input } from "@/registry/reziui/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/reziui/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Share2Icon />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="grid gap-3">
        <div className="grid gap-1">
          <p className="leading-5 font-medium">Share link</p>
          <p className="text-[13px] leading-normal text-muted-foreground">Anyone with the link can view this page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input aria-label="Share link" defaultValue="rezi.dev/s/k3J9" readOnly />
          <Button variant="secondary" size="icon" aria-label="Copy link">
            <CopyIcon />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
