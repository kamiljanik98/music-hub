"use client";

import usePlayer from "@/hooks/player/use-player";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const Speed = () => {
  const playbackRate = usePlayer((state) => state.playbackRate);
  const setPlaybackRate = usePlayer((state) => state.setPlaybackRate);

  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Speed
      </span>

      {SPEEDS.map((speed) => (
        <button
          key={speed}
          type="button"
          onClick={() => setPlaybackRate(speed)}
          aria-pressed={playbackRate === speed}
          className={`rounded-md px-2 py-1 text-xs transition-colors ${
            playbackRate === speed
              ? "bg-white/10 text-foreground"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          {speed}x
        </button>
      ))}
    </div>
  );
};
