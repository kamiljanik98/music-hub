"use client";

import Image from "next/image";
import { getCoverUrl } from "@/lib/r2/public";
import { formatSongMeta } from "@/lib/format/song-meta";
import { TitleLink } from "@/components/songs/title-link";
import { Actions } from "@/components/songs/actions";
import { Waveform as SongWaveform } from "@/components/songs/waveform";
import { Song } from "@/types";
import { formatRelativeTime } from "@/lib/format/relative-time";

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
    <div className="group/item flex flex-col gap-4 rounded-lg sm:flex-row sm:gap-6">
      <Image
        src={getCoverUrl(song.image_path)}
        alt={song.title}
        width={128}
        height={128}
        className="size-24 shrink-0 rounded-md object-cover sm:size-38"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex justify-between">
          <span>
            <TitleLink
              songId={song.id}
              title={song.title}
              className="text-sm font-medium"
            />

            {meta ? (
              <p className="truncate font-mono text-xs text-[var(--mh-text-mono)]">
                {meta}
              </p>
            ) : (
              <p className="font-mono text-xs text-[var(--mh-text-mono)]">
                No tracks details
              </p>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Actions
              songId={song.id}
              isLikedInitially={isLikedInitially}
              isOwner={isOwner}
              song={song}
            />
          </div>
        </div>
        <SongWaveform
          songId={song.id}
          path={song.path}
          onActivate={onPlay}
          lazyMount
        />
        <p className="font-mono text-[11px] text-[var(--mh-text-mono)]">
          posted {formatRelativeTime(song.created_at)}
        </p>
      </div>
    </div>
  );
};
