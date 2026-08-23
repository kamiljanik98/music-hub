"use client";

import { useOnPlay } from "@/hooks/player/use-on-play";
import { LikedRow } from "@/components/songs/liked-row";
import type { LikedSong } from "@/actions/songs/get-liked-songs";

type SongListProps = {
  songs: LikedSong[];
};

export function SongList({ songs }: SongListProps) {
  const onPlay = useOnPlay(songs);

  if (!songs.length) return null;

  return (
    <div className="flex w-full flex-col gap-2.5">
      {songs.map((song) => (
        <LikedRow
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
