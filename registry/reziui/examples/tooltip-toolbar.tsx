import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/reziui/ui/tooltip";

const TOOLS = [
  { label: "Bold", icon: BoldIcon },
  { label: "Italic", icon: ItalicIcon },
  { label: "Underline", icon: UnderlineIcon },
];

export default function TooltipToolbar() {
  return (
    <TooltipProvider>
      <div role="toolbar" aria-label="Text formatting" className="flex gap-1">
        {TOOLS.map(({ label, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" static aria-label={label}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
