"use client";

import { useOnPlay } from "@/hooks/player/use-on-play";
import { SongPost } from "@/components/songs/song-post";
import { Song } from "@/types";

type SongListProps = {
  songs: Song[];
};

export function SongList({ songs }: SongListProps) {
  const onPlay = useOnPlay(songs);

  if (!songs.length) return null;

  return (
    <div className="flex w-full flex-col gap-5">
      {songs.map((song) => (
        <SongPost
          key={song.id}
          song={song}
          onPlay={onPlay}
          isLikedInitially={song.isLiked}
        />
      ))}
    </div>
  );
}
