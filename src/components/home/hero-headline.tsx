"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  ["Someone out there", "is waiting", "to hear it"],
  ["Your best take", "is still", "unheard"],
  ["Post it rough", "share it now", "let them listen"],
] as const;

const CYCLE_MS = 7000;

export const HeroHeadline = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((value) => (value + 1) % PHRASES.length),
      CYCLE_MS,
    );

    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="font-display min-h-[2.76em] text-balance text-[clamp(36px,5.2vw,80px)] leading-[0.92] tracking-[0.02em] uppercase text-foreground">
      {PHRASES[index].map((line, lineIndex) => (
        <span key={`${index}-${lineIndex}`} className="mh-write-line">
          {line}
        </span>
      ))}
    </h1>
  );
};
