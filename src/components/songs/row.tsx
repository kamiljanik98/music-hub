"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { formatSongMeta } from "@/lib/format/song-meta";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { TitleLink } from "@/components/songs/title-link";
import { cn } from "@/lib/utils";
import { Actions } from "./actions";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/use-player";

type RowProps = {
  song: Song;
  onPlay: (id: string) => void;
  isLikedInitially?: boolean;
  isOwner?: boolean;
  postedAt?: string;
};

export const Row = ({
  song,
  onPlay,
  isLikedInitially = false,
  isOwner = false,
  postedAt,
}: RowProps) => {
  const meta = formatSongMeta(song);

  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const isActive = activeId === song.id;

  return (
    <div
      className={cn(
        "group/row flex items-center gap-5 rounded-[var(--radius-lg)] border border-border bg-card py-3.5 pr-6 pl-3.5 transition hover:bg-[var(--mh-glass-hover)]",
        isActive && "bg-[var(--mh-glass-hover)]",
      )}
    >
      <div className="relative shrink-0">
        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          width={56}
          height={56}
          className="size-14 rounded-[var(--radius-md)] object-cover"
        />

        <button
          onClick={() => onPlay(song.id)}
          className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-md)] bg-[rgba(10,10,10,0.45)] opacity-0 transition-opacity group-hover/row:opacity-100"
          aria-label={isActive && isPlaying ? "Pause" : `Play ${song.title}`}
        >
          {isActive && isPlaying ? (
            <Pause className="size-3.5 text-foreground" fill="currentColor" />
          ) : (
            <Play className="size-3.5 text-foreground" fill="currentColor" />
          )}
        </button>
      </div>

      <div className="flex min-w-0 flex-[1_1_180px] flex-col gap-[3px]">
        <TitleLink songId={song.id} title={song.title} className="text-base" />

        <div className="flex items-center gap-1.5">
          <Image
            src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
            alt={song.profiles?.nickname ?? "Unknown"}
            width={16}
            height={16}
            className="rounded-full"
          />

          <p className="truncate text-sm text-[var(--mh-text-meta)]">
            {song.profiles?.nickname ?? "Unknown"}
          </p>
        </div>
      </div>

      {postedAt && (
        <p className="hidden shrink-0 text-sm text-[var(--mh-text-meta)] sm:block">
          {formatRelativeTime(postedAt)}
        </p>
      )}

      {meta && (
        <p className="hidden shrink-0 truncate font-mono text-[13px] text-[var(--mh-text-meta)] sm:block">
          {meta}
        </p>
      )}

      <Actions
        songId={song.id}
        isLikedInitially={isLikedInitially}
        isOwner={isOwner}
        song={song}
      />
    </div>
  );
};
