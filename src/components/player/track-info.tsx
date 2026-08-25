"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Song } from "@/types";
import { getCoverUrl } from "@/lib/r2/public";
import { cn } from "@/lib/utils";
import { useLike } from "@/hooks/social/use-like";

import { TitleLink } from "@/components/songs/title-link";

interface TrackInfoProps {
  song: Song;
}

export function TrackInfo({ song }: TrackInfoProps) {
  const nickname = song.profiles?.nickname;
  const { isLiked, toggle } = useLike(song.id, song.isLiked ?? false);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="group relative size-14 shrink-0">
        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          width={56}
          height={56}
          className="size-14 rounded-sm object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={isLiked ? "Unlike" : "Like"}
          aria-pressed={isLiked}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-sm bg-black/55 opacity-0 transition-opacity duration-200 outline-none",
            "group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
            isLiked && "opacity-100",
          )}
        >
          <Heart
            className={cn(
              "size-5 text-white transition-transform duration-200 group-hover:scale-110",
              isLiked && "fill-primary text-primary",
            )}
          />
        </button>
      </div>
      <div className="flex min-w-0 flex-col">
        <TitleLink
          songId={song.id}
          title={song.title}
          className="text-sm font-medium"
        />
        {nickname ? (
          <Link
            href={`/profile/${nickname}`}
            className="truncate text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            {nickname}
          </Link>
        ) : (
          <span className="truncate text-xs text-muted-foreground">Unknown</span>
        )}
      </div>
    </div>
  );
}
