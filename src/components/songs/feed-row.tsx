"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { TitleLink } from "@/components/songs/title-link";
import { cn } from "@/lib/utils";
import { Actions } from "./actions";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/use-player";

const VISIBLE_TAGS = 3;

type FeedRowProps = {
  song: Song;
  onPlay: (id: string) => void;
  likesCount?: number;
  stemCount?: number;
  isLikedInitially?: boolean;
  isOwner?: boolean;
};

export const FeedRow = ({
  song,
  onPlay,
  likesCount = 0,
  stemCount = 0,
  isLikedInitially = false,
  isOwner = false,
}: FeedRowProps) => {
  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const isActive = activeId === song.id;

  const nickname = song.profiles?.nickname ?? "Unknown";

  const details = [
    song.genre,
    song.bpm && `${song.bpm} BPM`,
    song.scale,
    stemCount > 0 && `${stemCount} ${stemCount === 1 ? "stem" : "stems"}`,
  ].filter(Boolean);

  const tags = song.tags ?? [];

  return (
    <div
      className={cn(
        "group/row flex flex-col gap-2 rounded-[var(--radius-lg)] py-3.5 pr-3 pl-3.5 sm:pr-5 transition hover:bg-[var(--mh-glass-hover)]",
        isActive && "bg-[var(--mh-glass-hover)]",
      )}
    >
      <p className="font-mono text-[11px] text-[var(--mh-text-mono)]">
        posted {formatRelativeTime(song.created_at)}
      </p>

      <div className="flex items-start gap-3 sm:gap-5">
        <div className="relative shrink-0">
          <Image
            src={getCoverUrl(song.image_path)}
            alt={song.title}
            width={72}
            height={72}
            className="size-18 rounded-[var(--radius-md)] object-cover"
          />

          <button
            onClick={() => onPlay(song.id)}
            className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-md)] bg-[rgba(10,10,10,0.45)] opacity-0 transition-opacity group-hover/row:opacity-100"
            aria-label={isActive && isPlaying ? "Pause" : `Play ${song.title}`}
          >
            {isActive && isPlaying ? (
              <Pause className="size-4 text-foreground" fill="currentColor" />
            ) : (
              <Play className="size-4 text-foreground" fill="currentColor" />
            )}
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-baseline gap-3">
            <TitleLink
              songId={song.id}
              title={song.title}
              className="text-base font-medium"
            />

            <p className="truncate font-mono text-[11px] text-[var(--mh-text-mono)]">
              {details.length ? details.join(" · ") : "No track details yet"}
            </p>
          </div>

          <Link
            href={`/profile/${song.profiles?.nickname ?? ""}`}
            className="flex w-fit shrink-0 items-center gap-1.5 text-[var(--mh-text-meta)] transition-colors hover:text-primary hover:underline"
          >
            <Image
              src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
              alt={nickname}
              width={16}
              height={16}
              className="rounded-full"
            />

            <span className="truncate text-sm">{nickname}</span>
          </Link>

          <div className="-ml-2 flex w-fit items-center">
            <Actions
              songId={song.id}
              isLikedInitially={isLikedInitially}
              isOwner={isOwner}
              song={song}
            />
          </div>

          <p className="truncate text-sm text-muted-foreground">
            {song.description || "No description for this track"}
          </p>

          {tags.length > 0 && (
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {tags.slice(0, VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag}
                  className="rounded-[var(--mh-radius-pill)] bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}

              {tags.length > VISIBLE_TAGS && (
                <span className="font-mono text-[11px] text-[var(--mh-text-mono)]">
                  +{tags.length - VISIBLE_TAGS}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-3 text-sm text-[var(--mh-text-meta)] sm:flex">
          <span className="flex items-center gap-1.5">
            <Play className="size-3.5" aria-hidden="true" />
            {song.play_count}
          </span>

          <span className="flex items-center gap-1.5">
            <Heart className="size-3.5" aria-hidden="true" />
            {likesCount}
          </span>
        </div>
      </div>
    </div>
  );
};
