"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { TitleLink } from "@/components/songs/title-link";
import { Actions } from "./actions";
import { Song } from "@/types";

type CardProps = {
  song: Song;
  onPlay: (id: string) => void;
  isLikedInitially?: boolean;
  isOwner?: boolean;
};

export const Card = ({
  song,
  onPlay,
  isLikedInitially = false,
  isOwner = false,
}: CardProps) => {
  return (
    <div className="group/card flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-2.5 transition hover:bg-[var(--mh-glass-hover)]">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)]">
        <div className="absolute top-2.5 right-2.5 z-10 rounded-[var(--mh-radius-pill)] bg-black/65 p-1 backdrop-blur-sm">
          <Actions
            songId={song.id}
            isLikedInitially={isLikedInitially}
            isOwner={isOwner}
            showCopyLink={false}
            song={song}
          />
        </div>

        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          width={240}
          height={240}
          className="size-full object-cover"
        />

        <span className="absolute right-2.5 bottom-2.5 rounded-[var(--mh-radius-pill)] border border-white/20 bg-[rgba(10,10,10,0.7)] px-2 py-1 font-display text-[10px] tracking-[0.1em] uppercase text-foreground backdrop-blur-sm">
          New
        </span>

        <button
          onClick={() => onPlay(song.id)}
          className="absolute bottom-3 left-3 flex size-12 items-center justify-center rounded-[var(--mh-radius-pill)] bg-primary text-primary-foreground transition-transform hover:scale-105"
          aria-label={`Play ${song.title}`}
        >
          <Play className="ml-0.5 size-5" fill="currentColor" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <TitleLink
            songId={song.id}
            title={song.title}
            className="truncate text-sm font-semibold"
          />

          <Link
            href={`/profile/${song.profiles?.nickname ?? ""}`}
            className="flex w-fit items-center gap-1.5"
          >
            <Image
              src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
              alt={song.profiles?.nickname ?? "Unknown"}
              width={16}
              height={16}
              className="rounded-full"
            />

            <span className="truncate text-xs text-[var(--mh-text-meta)] transition-colors hover:text-foreground">
              {song.profiles?.nickname ?? "Unknown"}
            </span>
          </Link>
        </div>

        <span className="my-1 h-0.25 w-full bg-neutral-800" />

        <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-[var(--mh-text-mono)]">
          <span className="truncate">{song.genre ?? "No genre"}</span>

          <span className="shrink-0">
            {formatRelativeTime(song.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};
