"use client";

import usePlayer from "@/hooks/player/use-player";
import { Repeat, Repeat1 } from "lucide-react";

export function RepeatButton() {
  const repeatMode = usePlayer((state) => state.repeatMode);
  const setRepeatMode = usePlayer((state) => state.setRepeatMode);

  const handleClick = () => {
    if (repeatMode === "off") {
      setRepeatMode("all");
    } else if (repeatMode === "all") {
      setRepeatMode("one");
    } else {
      setRepeatMode("off");
    }
  };

  const isActive = repeatMode !== "off";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        repeatMode === "off"
          ? "Repeat off"
          : repeatMode === "all"
            ? "Repeat all"
            : "Repeat one"
      }
      className="cursor-pointer text-neutral-400 transition-colors hover:text-white"
    >
      <span className="relative block h-5 w-5">
        {repeatMode === "one" ? (
          <Repeat1 size={20} className={isActive ? "text-primary" : ""} />
        ) : (
          <Repeat size={20} className={isActive ? "text-primary" : ""} />
        )}

        {repeatMode === "all" && (
          <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
        )}
      </span>
    </button>
  );
}
