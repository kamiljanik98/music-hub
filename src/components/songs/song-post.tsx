"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { Actions } from "./actions";
import { TitleLink } from "@/components/songs/title-link";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/use-player";
import { cn } from "@/lib/utils";

type SongPostProps = {
  song: Song;
  onPlay: (id: string) => void;
  isLikedInitially?: boolean;
  isOwner?: boolean;
};

export function SongPost({
  song,
  onPlay,
  isLikedInitially = false,
  isOwner = false,
}: SongPostProps) {
  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const isActive = activeId === song.id;

  return (
    <article
      className={cn(
        "w-full rounded-[var(--radius-lg)] border border-border bg-card transition",
        isActive && "bg-[var(--mh-glass-hover)]",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-4">
        <Link
          href={`/profile/${song.profiles?.nickname ?? ""}`}
          className="flex min-w-0 items-center gap-3"
        >
          <Image
            src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
            alt={song.profiles?.nickname ?? "Unknown"}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {song.profiles?.nickname ?? "Unknown"}
            </p>

            <p className="font-mono text-[11px] text-[var(--mh-text-mono)]">
              posted {formatRelativeTime(song.created_at)}
            </p>
          </div>
        </Link>

        <Actions
          songId={song.id}
          isLikedInitially={isLikedInitially}
          isOwner={isOwner}
          song={song}
        />
      </div>

      {/* Cover */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          fill
          className="object-cover"
        />

        <button
          onClick={() => onPlay(song.id)}
          className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
          aria-label={isActive && isPlaying ? "Pause" : `Play ${song.title}`}
        >
          {isActive && isPlaying ? (
            <Pause className="size-4" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 size-4" fill="currentColor" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <TitleLink
          songId={song.id}
          title={song.title}
          className="text-lg font-semibold"
        />

        {song.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {song.description}
          </p>
        )}

        {/* Song information */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {song.genre && (
            <div>
              <span className="text-muted-foreground">Genre </span>
              <span>{song.genre}</span>
            </div>
          )}

          {song.bpm && (
            <div>
              <span className="text-muted-foreground">BPM </span>
              <span className="font-mono">{song.bpm}</span>
            </div>
          )}

          {song.scale && (
            <div>
              <span className="text-muted-foreground">Scale </span>
              <span>{song.scale}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {song.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {song.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[var(--mh-radius-pill)] bg-muted px-2 py-1 text-[11px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="h-px w-full bg-border" />

        <p className="font-mono text-[11px] text-[var(--mh-text-mono)]">
          {[song.genre, song.bpm && `${song.bpm} BPM`, song.scale]
            .filter(Boolean)
            .join(" · ") || "No track details yet"}
        </p>
      </div>
    </article>
  );
}
