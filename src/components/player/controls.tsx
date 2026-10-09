"use client";

import usePlayer from "@/hooks/player/use-player";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export function Controls() {
  const isPlaying = usePlayer((s) => s.isPlaying);
  const ids = usePlayer((s) => s.ids);
  const activeId = usePlayer((s) => s.activeId);
  const setActiveId = usePlayer((s) => s.setActiveId);
  const repeatMode = usePlayer((s) => s.repeatMode);
  const requestPlayPause = usePlayer((s) => s.requestPlayPause);

  const handleNext = () => {
    if (!ids.length || !activeId) return;

    const currentIndex = ids.indexOf(activeId);
    const nextId = ids[currentIndex + 1];

    if (nextId) {
      setActiveId(nextId);
    } else if (repeatMode === "all") {
      setActiveId(ids[0]);
    }
  };

  const handlePrev = () => {
    if (!ids.length || !activeId) return;

    const currentIndex = ids.indexOf(activeId);
    const prevId = ids[currentIndex - 1] ?? ids[ids.length - 1];

    setActiveId(prevId);
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={handlePrev}
        className="cursor-pointer text-neutral-300 transition-opacity hover:opacity-80 hover:text-foreground"
        aria-label="Previous"
      >
        <SkipBack className="size-4" fill="currentColor" />
      </button>

      <button
        type="button"
        onClick={requestPlayPause}
        className={cn(
          "flex size-8 cursor-pointer items-center justify-center rounded-full",
          "bg-primary text-primary-foreground transition-opacity hover:opacity-80",
        )}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="size-4" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 size-4" fill="currentColor" />
        )}
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="cursor-pointer text-neutral-300 transition-opacity hover:opacity-80 hover:text-foreground"
        aria-label="Next"
      >
        <SkipForward className="size-4" fill="currentColor" />
      </button>
    </div>
  );
}
