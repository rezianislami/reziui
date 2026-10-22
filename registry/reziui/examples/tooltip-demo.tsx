import { CopyIcon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/reziui/ui/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Copy to clipboard">
          <CopyIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy to clipboard</TooltipContent>
    </Tooltip>
  );
}
