"use client";

import { Play, Pause } from "lucide-react";
import usePlayer from "@/hooks/player/use-player";
import { useWaveform } from "@/hooks/songs/use-waveform";

interface WaveformProps {
  songId: string;
  path: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  lazyMount?: boolean;
  onActivate?: (songId: string) => void;
}

export const Waveform = ({
  songId,
  path,
  height = 72,
  barWidth = 4,
  barGap = 4,
  barRadius = 4,
  lazyMount = false,
  onActivate,
}: WaveformProps) => {
  const activeId = usePlayer((s) => s.activeId);
  const requestPlayPause = usePlayer((s) => s.requestPlayPause);
  const setActiveId = usePlayer((s) => s.setActiveId);
  const fallbackActivate = () => {
    songId === activeId ? requestPlayPause() : setActiveId(songId);
  };
  const activate = onActivate ?? fallbackActivate;

  const { containerRef, isActive, isPlaying, handleClick, rootRef } =
    useWaveform({
      songId,
      path,
      height: height,
      barWidth: barWidth,
      barGap: barGap,
      barRadius: barRadius,
      lazyMount: lazyMount,
      onActivate: () => activate(songId),
    });

  return (
    <div ref={rootRef} className="flex items-center gap-4">
      <button
        onClick={() => activate(songId)}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
        aria-label={isActive && isPlaying ? "Pause" : "Play"}
      >
        {isActive && isPlaying ? (
          <Pause className="size-5" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 size-5" fill="currentColor" />
        )}
      </button>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="h-[72px] flex-1 cursor-pointer"
      />
    </div>
  );
};
