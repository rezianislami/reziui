"use client";

import type { PointerEvent, ReactNode } from "react";

// One listener for the whole grid: on pointer move it writes the pointer's
// position inside the hovered card to --spot-x / --spot-y, which the card's
// .spotlight ring gradient reads. Written straight to the element's style, so
// moving the mouse never re-renders React. Touch pointers are ignored — there
// is no hover to follow.
export function SpotlightGrid({ className, children }: { className?: string; children: ReactNode }) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const card = (event.target as HTMLElement).closest<HTMLElement>(".spotlight");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
