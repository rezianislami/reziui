"use client";

import { useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/registry/reziui/ui/button";
import { Checkbox } from "@/registry/reziui/ui/checkbox";
import { Label } from "@/registry/reziui/ui/label";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/reziui/ui/sheet";

const STATUSES = ["Active", "Paused", "Archived"];

export default function SheetDemo() {
  const [selected, setSelected] = useState<string[]>(["Active"]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <SlidersHorizontalIcon />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the project list.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <fieldset className="grid gap-3">
            <legend className="mb-3 text-[13px] leading-5 font-medium">Status</legend>
            {STATUSES.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selected.includes(status)}
                  onCheckedChange={(checked) =>
                    setSelected((prev) => (checked === true ? [...prev, status] : prev.filter((s) => s !== status)))
                  }
                />
                <Label htmlFor={`status-${status}`}>{status}</Label>
              </div>
            ))}
          </fieldset>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" onClick={() => setSelected([])}>
            Reset
          </Button>
          <SheetClose asChild>
            <Button>Apply filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
