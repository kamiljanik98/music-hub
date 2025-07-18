import React, { RefObject } from "react";

export function Waveform({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  return <div ref={containerRef} className="w-full h-full" />;
}