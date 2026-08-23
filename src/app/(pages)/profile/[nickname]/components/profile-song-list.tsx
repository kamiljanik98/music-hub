"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { Song } from "@/types";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { formatSongMeta } from "@/lib/format/song-meta";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { TitleLink } from "@/components/songs/title-link";
import usePlayer from "@/hooks/player/use-player";
import { useOnPlay } from "@/hooks/player/use-on-play";
import { cn } from "@/lib/utils";

type ProfileSongListProps = {
  songs: Song[];
  nickname: string;
};

export function ProfileSongList({ songs, nickname }: ProfileSongListProps) {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);

  if (!songs.length) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Likes</h2>

        {songs.length > 5 && (
          <Link
            href={`/profile/${nickname}/likes`}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            See all
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {songs.slice(0, 5).map((song) => {
          const isActive = activeId === song.id;
          const meta = formatSongMeta(song);

          return (
            <div
              key={song.id}
              className={cn(
                "group flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 transition-colors",
                "hover:bg-[var(--mh-glass-hover)]",
                isActive && "bg-[var(--mh-glass-hover)]",
              )}
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-[var(--radius-md)]">
                <Image
                  src={getCoverUrl(song.image_path)}
                  alt={song.title}
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />

                <button
                  onClick={() => onPlay(song.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label={
                    isActive && isPlaying
                      ? `Pause ${song.title}`
                      : `Play ${song.title}`
                  }
                >
                  {isActive && isPlaying ? (
                    <Pause className="size-4 text-white" fill="currentColor" />
                  ) : (
                    <Play
                      className="ml-0.5 size-4 text-white"
                      fill="currentColor"
                    />
                  )}
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <TitleLink
                    songId={song.id}
                    title={song.title}
                    className="truncate text-sm font-medium"
                  />

                  <span className="hidden shrink-0 text-[10px] text-muted-foreground sm:inline">
                    {formatRelativeTime(song.created_at)}
                  </span>
                </div>

                <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                  <Image
                    src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
                    alt={song.profiles?.nickname ?? "Unknown"}
                    width={14}
                    height={14}
                    className="size-3.5 shrink-0 rounded-full"
                  />

                  <span className="truncate text-xs text-[var(--mh-text-meta)]">
                    {song.profiles?.nickname ?? "Unknown"}
                  </span>

                  {meta && (
                    <>
                      <span className="text-muted-foreground/40">·</span>

                      <span className="truncate font-mono text-[10px] text-[var(--mh-text-mono)]">
                        {meta}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
