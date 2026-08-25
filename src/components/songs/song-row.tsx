"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { TitleLink } from "@/components/songs/title-link";
import { cn } from "@/lib/utils";
import { Actions } from "./actions";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/use-player";

type SongRowProps = {
  song: Song;
  onPlay: (id: string) => void;
  likesCount: number;
  isLikedInitially?: boolean;
  isOwner?: boolean;
};

export const SongRow = ({
  song,
  onPlay,
  likesCount,
  isLikedInitially = false,
  isOwner = false,
}: SongRowProps) => {
  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const isActive = activeId === song.id;

  return (
    <div
      className={cn(
        "group/row flex items-center gap-3 rounded-lg sm:gap-5 py-3.5 pr-3 pl-3.5 sm:pr-6 transition hover:bg-[var(--mh-glass-hover)]",
        isActive && "bg-[var(--mh-glass-hover)]",
      )}
    >
      <div className="relative shrink-0">
        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          width={64}
          height={64}
          className="size-16 rounded-md object-cover"
        />

        <button
          onClick={() => onPlay(song.id)}
          className="absolute inset-0 flex items-center justify-center rounded-md bg-[rgba(10,10,10,0.45)] opacity-0 transition-opacity group-hover/row:opacity-100"
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

        <Link
          href={`/profile/${song.profiles?.nickname ?? ""}`}
          className="flex w-fit items-center gap-1.5 text-[var(--mh-text-meta)] transition-colors hover:text-primary hover:underline"
        >
          <Image
            src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
            alt={song.profiles?.nickname ?? "Unknown"}
            width={16}
            height={16}
            className="rounded-full"
          />

          <p className="truncate text-sm">
            {song.profiles?.nickname ?? "Unknown"}
          </p>
        </Link>
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

      <Actions
        songId={song.id}
        isLikedInitially={isLikedInitially}
        isOwner={isOwner}
        song={song}
      />
    </div>
  );
};
