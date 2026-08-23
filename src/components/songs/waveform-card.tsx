"use client";

import Image from "next/image";
import { getCoverUrl } from "@/lib/r2/public";
import { formatSongMeta } from "@/lib/format/song-meta";
import { TitleLink } from "@/components/songs/title-link";
import { Actions } from "./actions";
import { Waveform as SongWaveform } from "./waveform";
import { Song } from "@/types";

type WaveformCardProps = {
  song: Song;
  onPlay: (id: string) => void;
  isLikedInitially?: boolean;
  isOwner?: boolean;
};

export const WaveformCard = ({
  song,
  onPlay,
  isLikedInitially = false,
  isOwner = false,
}: WaveformCardProps) => {
  const meta = formatSongMeta(song);

  return (
    <div className="group/item flex gap-3 rounded-[var(--radius-lg)] p-3 transition hover:bg-[var(--mh-glass-hover)]">
      <Image
        src={getCoverUrl(song.image_path)}
        alt={song.title}
        width={64}
        height={64}
        className="size-20 shrink-0 rounded-[var(--radius-md)] object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <TitleLink
          songId={song.id}
          title={song.title}
          className="text-sm font-medium"
        />

        {meta && (
          <p className="truncate font-mono text-xs text-[var(--mh-text-mono)]">
            {meta}
          </p>
        )}

        <SongWaveform
          songId={song.id}
          path={song.path}
          onActivate={onPlay}
          lazyMount
        />

        <div className="flex items-center gap-2">
          <Actions
            songId={song.id}
            isLikedInitially={isLikedInitially}
            isOwner={isOwner}
            song={song}
          />
        </div>
      </div>
    </div>
  );
};
