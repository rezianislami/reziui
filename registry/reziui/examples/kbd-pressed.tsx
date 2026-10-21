"use client";

import { useEffect, useState } from "react";
import { Kbd, KbdGroup } from "@/registry/reziui/ui/kbd";

const KEYS = ["Shift", "A", "S", "D"] as const;

export default function KbdPressed() {
  const [down, setDown] = useState<Set<string>>(new Set());

  useEffect(() => {
    const normalize = (key: string) => (key.length === 1 ? key.toUpperCase() : key);
    const press = (event: KeyboardEvent) => setDown((prev) => new Set(prev).add(normalize(event.key)));
    const release = (event: KeyboardEvent) =>
      setDown((prev) => {
        const next = new Set(prev);
        next.delete(normalize(event.key));
        return next;
      });
    // Keyup never arrives if focus leaves the window mid-press.
    const reset = () => setDown(new Set());
    window.addEventListener("keydown", press);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", press);
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <KbdGroup>
        {KEYS.map((key) => (
          <Kbd key={key} pressed={down.has(key)}>
            {key}
          </Kbd>
        ))}
      </KbdGroup>
      <p className="text-xs text-muted-foreground">Press Shift, A, S or D.</p>
    </div>
  );
}
