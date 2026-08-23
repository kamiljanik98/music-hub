"use client";

import { useOnPlay } from "@/hooks/player/use-on-play";
import { Row } from "@/components/songs/row";
import { Song } from "@/types";

type SongListProps = {
  songs: Song[];
};

export function SongList({ songs }: SongListProps) {
  const onPlay = useOnPlay(songs);

  if (!songs.length) return null;

  return (
    <div className="flex w-full flex-col gap-2.5">
      {songs.map((song) => (
        <Row
          key={song.id}
          song={song}
          onPlay={onPlay}
          postedAt={song.created_at}
          isLikedInitially={song.isLiked}
        />
      ))}
    </div>
  );
}
