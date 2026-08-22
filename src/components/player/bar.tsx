"use client";

import { useGetSongById } from "@/hooks/songs/use-get-song-by-id";
import usePlayer from "@/hooks/player/use-player";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { Volume } from "./volume";
import { usePathname } from "next/navigation";
import { Seekbar } from "./seekbar";
import { RepeatButton } from "./repeat-button";

export const Bar = () => {
  const activeId = usePlayer((state) => state.activeId);
  const { song } = useGetSongById(activeId);
  const pathname = usePathname();

  if (!activeId || !song) return null;
  if (pathname.startsWith("/upload")) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex justify-center rounded-[var(--mh-radius-card)] border border-white/12 bg-card">
      <div className="w-full max-w-[var(--mh-content-max)] px-5 py-3">
        <div className="grid grid-cols-3 items-center">
          <TrackInfo song={song} />
          <Controls song={song} />

          <div className="flex items-center justify-end gap-4">
            <Volume />
            <RepeatButton />
          </div>
        </div>
        <Seekbar />
      </div>
    </div>
  );
};
