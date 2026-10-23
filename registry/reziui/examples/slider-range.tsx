"use client";

import { useState } from "react";
import { Slider } from "@/registry/reziui/ui/slider";

export default function SliderRange() {
  const [price, setPrice] = useState([25, 70]);

  return (
    <div className="grid w-full max-w-60 gap-2.5">
      <p className="flex items-center justify-between text-[13px]">
        <span className="font-medium text-foreground">Price</span>
        <span className="text-muted-foreground tabular-nums">
          ${price[0]} – ${price[1]}
        </span>
      </p>
      <Slider
        value={price}
        onValueChange={setPrice}
        minStepsBetweenThumbs={5}
        thumbLabels={["Minimum price", "Maximum price"]}
      />
    </div>
  );
}
