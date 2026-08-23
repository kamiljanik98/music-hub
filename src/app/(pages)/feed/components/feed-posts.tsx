"use client";

import { useSyncExternalStore } from "react";
import { LayoutList, Rows3 } from "lucide-react";
import { useOnPlay } from "@/hooks/player/use-on-play";
import { SongPost } from "@/components/songs/song-post";
import { FeedRow } from "@/components/songs/feed-row";
import { cn } from "@/lib/utils";
import type { FeedSong } from "@/actions/songs/get-followed-artists-songs";

const DENSITY_KEY = "mh-feed-density";

type Density = "cards" | "compact";

const readDensity = (): Density => {
  try {
    return localStorage.getItem(DENSITY_KEY) === "compact"
      ? "compact"
      : "cards";
  } catch {
    return "cards";
  }
};

let currentDensity: Density | null = null;

const listeners = new Set<() => void>();

const subscribeToDensity = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getDensitySnapshot = (): Density => {
  if (currentDensity === null) currentDensity = readDensity();
  return currentDensity;
};

const getDensityServerSnapshot = (): Density => "cards";

const change = (next: Density) => {
  currentDensity = next;

  try {
    localStorage.setItem(DENSITY_KEY, next);
  } catch {
    /* empty */
  }

  listeners.forEach((listener) => listener());
};

type FeedPostsProps = {
  songs: FeedSong[];
  eyebrow: string;
  note?: string;
};

export function FeedPosts({ songs, eyebrow, note }: FeedPostsProps) {
  const density = useSyncExternalStore(
    subscribeToDensity,
    getDensitySnapshot,
    getDensityServerSnapshot,
  );
  const onPlay = useOnPlay(songs);

  const options: { value: Density; icon: typeof Rows3; label: string }[] = [
    { value: "cards", icon: LayoutList, label: "Card view" },
    { value: "compact", icon: Rows3, label: "Compact view" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </p>

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
          <div className="mr-auto flex shrink-0 items-center gap-1 self-center">
            {options.map(({ value, icon: Icon, label: optionLabel }) => (
              <button
                key={value}
                type="button"
                onClick={() => change(value)}
                aria-label={optionLabel}
                aria-pressed={density === value}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-foreground",
                  density === value &&
                    "bg-[var(--mh-glass-hover)] text-foreground",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>

          <h1 className="font-display text-4xl leading-none tracking-tight uppercase text-foreground md:text-6xl">
            Posts
          </h1>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{songs.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      {note && (
        <p className="-mt-4 mb-2 text-sm text-muted-foreground">{note}</p>
      )}

      {density === "compact" ? (
        <div className="flex w-full flex-col gap-2.5">
          {songs.map((song) => (
            <FeedRow
              key={song.id}
              song={song}
              onPlay={onPlay}
              likesCount={song.likesCount}
              stemCount={song.stemCount}
              isLikedInitially={song.isLiked}
            />
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col gap-5">
          {songs.map((song) => (
            <SongPost
              key={song.id}
              song={song}
              onPlay={onPlay}
              likesCount={song.likesCount}
              stemCount={song.stemCount}
              isLikedInitially={song.isLiked}
            />
          ))}
        </div>
      )}
    </div>
  );
}
