"use client";

import { useState } from "react";
import { Checkbox } from "@/registry/reziui/ui/checkbox";
import { Label } from "@/registry/reziui/ui/label";

const ITEMS = ["Comments", "Mentions", "Weekly digest"];

export default function CheckboxSelectAll() {
  const [selected, setSelected] = useState<string[]>(["Mentions"]);
  const all = selected.length === ITEMS.length ? true : selected.length > 0 ? "indeterminate" : false;

  const toggle = (item: string, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, item] : prev.filter((i) => i !== item)));

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Email notifications</legend>
      <div className="flex items-center gap-2">
        <Checkbox
          id="notify-all"
          checked={all}
          onCheckedChange={(checked) => setSelected(checked === true ? ITEMS : [])}
        />
        <Label htmlFor="notify-all">All notifications</Label>
      </div>
      <div className="grid gap-3 ps-6">
        {ITEMS.map((item) => {
          const id = `notify-${item.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <div key={item} className="flex items-center gap-2">
              <Checkbox
                id={id}
                checked={selected.includes(item)}
                onCheckedChange={(checked) => toggle(item, checked === true)}
              />
              <Label htmlFor={id}>{item}</Label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
