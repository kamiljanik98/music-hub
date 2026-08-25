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
    <>
      <div aria-hidden="true" className="h-[116px] shrink-0" />

      <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[var(--mh-content-max)] rounded-lg border border-white/12 bg-[rgba(23,23,23,0.72)] mh-glass">
        <div className="relative w-full px-3 py-2.5">
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-out",
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
            aria-hidden={!isExpanded}
          >
            <div className="overflow-hidden">
              <div className="mb-4 flex flex-wrap items-center justify-center gap-6 border-b border-border/60 pb-4">
                <Speed />

                <div className="md:hidden">
                  <Volume />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-3 md:gap-0">
            <TrackInfo song={song} />

            <div className="flex items-center gap-2 md:contents">
              <Controls song={song} />

              <div className="flex items-center justify-end gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded((value) => !value)}
                  className={cn(
                    "flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/5 hover:text-foreground",
                    isExpanded
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-label="Playback speed"
                  aria-pressed={isExpanded}
                >
                  <Gauge className="size-5" strokeWidth={2.25} />
                </button>

                <div className="hidden md:block">
                  <Volume />
                </div>

                <RepeatButton />
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Seekbar />
          </div>
        </div>
      </div>
    </>
  );
};
