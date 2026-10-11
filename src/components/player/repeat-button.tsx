"use client";

import { Repeat, Repeat1 } from "lucide-react";

import usePlayer from "@/hooks/player/use-player";
import { cn } from "@/lib/utils";

type RepeatButtonProps = {
  className?: string;
};

export function RepeatButton({ className }: RepeatButtonProps) {
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
  const Icon = repeatMode === "one" ? Repeat1 : Repeat;

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
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center text-neutral-400 transition-colors hover:text-white",
        className,
      )}
    >
      <Icon className={cn("size-5", isActive && "text-primary")} />

      {repeatMode === "all" && (
        <span className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
      )}
    </button>
  );
}
