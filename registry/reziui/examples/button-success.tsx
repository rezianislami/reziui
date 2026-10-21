"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/registry/reziui/ui/button";

export default function ButtonSuccess() {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function save() {
    setState("saving");
    // Stand-in for a real request.
    timer.current = setTimeout(() => {
      setState("saved");
      timer.current = setTimeout(() => setState("idle"), 2000);
    }, 900);
  }

  return (
    <Button loading={state === "saving"} success={state === "saved"} onClick={save}>
      Save changes
    </Button>
  );
}
