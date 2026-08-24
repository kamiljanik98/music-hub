"use client";

import { useOnPlay } from "@/hooks/player/use-on-play";
import { SongRow } from "@/components/songs/song-row";
import type { Song } from "@/types";

type SongRowListProps = {
  songs: (Song & { likesCount: number })[];
};

export function SongRowList({ songs }: SongRowListProps) {
  const onPlay = useOnPlay(songs);

  if (!songs.length) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {songs.map((song) => (
        <SongRow
          key={song.id}
          song={song}
          onPlay={onPlay}
          likesCount={song.likesCount}
          isLikedInitially={song.isLiked}
        />
      ))}
    </div>
  );
}
