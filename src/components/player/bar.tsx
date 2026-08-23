"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";
import { usePathname } from "next/navigation";

import { useGetSongById } from "@/hooks/songs/use-get-song-by-id";
import usePlayer from "@/hooks/player/use-player";
import { cn } from "@/lib/utils";

import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { Volume } from "./volume";
import { Seekbar } from "./seekbar";
import { RepeatButton } from "./repeat-button";
import { Speed } from "./speed";

export const Bar = () => {
  const activeId = usePlayer((state) => state.activeId);
  const { song } = useGetSongById(activeId);
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeId || !song) return null;
  if (pathname.startsWith("/upload")) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[var(--mh-content-max)] rounded-[var(--radius-lg)] border border-white/12 bg-[rgba(23,23,23,0.72)] backdrop-blur-[24px] backdrop-saturate-[1.4]">
      <div className="relative w-full px-3 py-2.5">
        {isExpanded && (
          <div className="mb-4 flex items-center justify-center border-b border-border/60 pb-4">
            <Speed />
          </div>
        )}

        <div className="grid grid-cols-3 items-center">
          <TrackInfo song={song} />

          <Controls song={song} />

          <div className="flex items-center justify-end gap-4">
            <Volume />
            <RepeatButton />

            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors hover:bg-white/5 hover:text-foreground",
                isExpanded
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground",
              )}
              aria-label="Playback speed"
              aria-pressed={isExpanded}
            >
              <Gauge className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-2">
          <Seekbar />
        </div>
      </div>
    </div>
  );
};
