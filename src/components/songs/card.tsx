"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { formatSongMeta } from "@/lib/format/song-meta";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { TitleLink } from "@/components/songs/title-link";
import { cn } from "@/lib/utils";
import { Actions } from "./actions";
import { Song } from "@/types";
import { Waveform } from "./waveform";
import usePlayer from "@/hooks/player/use-player";

type SongCardProps = {
  song: Song;
  onPlay: (id: string) => void;
  showWaveform?: boolean;
  variant?: "grid" | "row" | "waveform";
  isLikedInitially?: boolean;
  postedAt?: string;
};

export const Card = ({
  song,
  onPlay,
  variant = "grid",
  isLikedInitially = false,
  postedAt,
}: SongCardProps) => {
  const meta = formatSongMeta(song);
  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const isActive = activeId === song.id;

  if (variant === "waveform") {
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
            <p className="truncate font-mono text-xs text-[var(--mh-text-mono)]">{meta}</p>
          )}
          <Waveform
            songId={song.id}
            path={song.path}
            onActivate={onPlay}
            lazyMount={true}
          />
          <div className="flex items-center gap-2">
            <Actions songId={song.id} isLikedInitially={isLikedInitially} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "row") {
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
          <TitleLink
            songId={song.id}
            title={song.title}
            className="text-base"
          />
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

        <Actions songId={song.id} isLikedInitially={isLikedInitially} />
      </div>
    );
  }

  return (
    <div className="group/card flex flex-col gap-2.5 transition">
      <Link
        href={`/profile/${song.profiles?.nickname ?? ""}`}
        className="w-fit"
      >
        <p className="truncate text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
          {song.profiles?.nickname ?? "Unknown"}
        </p>
      </Link>

      <div className="relative">
        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          width={160}
          height={160}
          className="aspect-square w-full rounded-[24px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-[rgba(10,10,10,0.45)] opacity-0 transition-opacity group-hover/card:opacity-100">
          <button
            onClick={() => onPlay(song.id)}
            className="flex size-11 items-center justify-center rounded-[var(--mh-radius-pill)] bg-primary text-primary-foreground transition-transform hover:scale-105"
            aria-label={`Play ${song.title}`}
          >
            <Play className="ml-0.5 size-4" fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <TitleLink
            songId={song.id}
            title={song.title}
            className="text-xs font-semibold"
          />
          <p className="truncate font-mono text-xs text-[var(--mh-text-mono)]">
            {meta || "No data..."}
          </p>
        </div>
        <Actions songId={song.id} isLikedInitially={isLikedInitially} />
      </div>
    </div>
  );
};
