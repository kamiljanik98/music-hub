"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSongs } from "@/hooks/songs/use-get-songs";
import { useOnPlay } from "@/hooks/player/use-on-play";
import { ShelfCard } from "./shelf-card";

type ShelfProps = {
  title: string;
};

const VISIBLE_LIMIT = 10;

export const Shelf = ({ title }: ShelfProps) => {
  const { songs, isLoading, error } = useGetSongs();
  const weeklySongs = songs.filter((song) => song.isNew);
  const visibleSongs = weeklySongs.slice(0, VISIBLE_LIMIT);
  const onPlay = useOnPlay(visibleSongs);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -480 : 480,
      behavior: "smooth",
    });
  };

  const todayCount = songs.filter((song) => song.isToday).length;

  const weeklyCount = weeklySongs.length;

  const header = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {todayCount > 0
            ? `${todayCount} ${todayCount === 1 ? "track" : "tracks"} uploaded today`
            : "Nothing new today"}
        </p>

        <div className="flex items-baseline gap-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-[0.02em] text-foreground md:text-5xl">
            {title}
          </h2>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{weeklyCount.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-foreground"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-foreground"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div>
        {header}
        <div className="min-h-[320px] animate-pulse rounded-md bg-neutral-800" />{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {header}
        <div className="flex h-48 items-center justify-center text-sm text-neutral-500">
          Failed to load songs.
        </div>
      </div>
    );
  }

  if (!songs.length) return null;

  if (!visibleSongs.length) {
    return (
      <div>
        {header}

        <p className="text-sm text-muted-foreground">
          Nothing landed this week yet — check the feed for everything else.
        </p>
      </div>
    );
  }

  return (
    <div>
      {header}

      <div
        ref={scrollRef}
        className="mh-scroll flex items-stretch gap-5 overflow-x-auto"
      >
        {visibleSongs.map((song) => (
          <div key={song.id} className="w-[160px] shrink-0 sm:w-[220px]">
            <ShelfCard
              isLikedInitially={song.isLiked}
              song={song}
              onPlay={onPlay}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
