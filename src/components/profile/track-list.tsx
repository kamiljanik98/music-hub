"use client";

import { Song } from "@/types";
import { useOnPlay } from "@/hooks/player/use-on-play";
import { WaveformCard } from "../songs/waveform-card";

type TrackListProps = {
  songs: Song[];
  isOwner?: boolean;
};

export const TrackList = ({ songs, isOwner = false }: TrackListProps) => {
  const onPlay = useOnPlay(songs);

  if (!songs.length) {
    return (
      <p className="text-sm text-muted-foreground">No tracks uploaded yet</p>
    );
  }

  return (
    <div className="flex flex-col">
      {songs.map((song) => (
        <WaveformCard
          key={song.id}
          song={song}
          onPlay={onPlay}
          isLikedInitially={song.isLiked}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
};
