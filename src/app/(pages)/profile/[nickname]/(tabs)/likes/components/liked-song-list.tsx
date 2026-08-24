"use client";

import { useState } from "react";
import { SongRowList } from "@/components/songs/song-row-list";
import type { Song } from "@/types";

type LikedSongListProps = {
  songs: (Song & { likesCount: number })[];
};

export const LikedSongList = ({ songs }: LikedSongListProps) => {
  const [rows] = useState(songs);

  return (
    <>
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          COLLECTION / LIKED TRACKS
        </p>

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl leading-none tracking-tight uppercase text-foreground md:text-6xl">
            LIKES
          </h1>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{rows.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      <SongRowList songs={rows} />
    </>
  );
};
