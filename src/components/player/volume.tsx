"use client";

import { Slider } from "@/components/ui/slider";
import usePlayer from "@/hooks/player/use-player";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useRef } from "react";

export function Volume() {
  const volume = usePlayer((state) => state.volume);
  const setVolume = usePlayer((state) => state.setVolume);
  const previousVolume = useRef(volume);

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setVolume(0);
    }
  };

  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={toggleMute}
        className="cursor-pointer text-neutral-300 transition-opacity hover:opacity-80 hover:text-foreground"
        aria-label={volume === 0 ? "Unmute" : "Mute"}
      >
        <Icon className="size-5" />
      </button>
      <Slider
        value={[volume * 100]}
        max={100}
        step={1}
        onPointerDown={() => {
          if (volume !== 0) {
            previousVolume.current = volume;
          }
        }}
        onValueChange={([value]) => setVolume(value / 100)}
        className="w-24"
      />
    </div>
  );
}
