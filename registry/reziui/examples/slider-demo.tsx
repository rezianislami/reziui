"use client";

import { useState } from "react";
import { Label } from "@/registry/reziui/ui/label";
import { Slider } from "@/registry/reziui/ui/slider";

export default function SliderDemo() {
  const [volume, setVolume] = useState([64]);

  return (
    <div className="grid w-full max-w-60 gap-2.5">
      <div className="flex items-center justify-between">
        <Label id="volume-label">Volume</Label>
        <output aria-hidden="true" className="text-[13px] text-muted-foreground tabular-nums">
          {volume[0]}
        </output>
      </div>
      <Slider value={volume} onValueChange={setVolume} aria-labelledby="volume-label" />
    </div>
  );
}
