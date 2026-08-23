"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSongs } from "@/hooks/songs/use-get-songs";
import { useOnPlay } from "@/hooks/player/use-on-play";
import { Card } from "@/components/songs/card";

type ShelfProps = {
  title: string;
};

export const Shelf = ({ title }: ShelfProps) => {
  const { songs, isLoading, error } = useGetSongs();
  const onPlay = useOnPlay(songs);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -480 : 480,
      behavior: "smooth",
    });
  };

  const header = (
    <div className="mb-6 flex items-center justify-between gap-6">
      <h2 className="font-display text-2xl uppercase tracking-[0.02em] text-foreground">
        {title}
      </h2>

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
        <div className="h-48 w-full animate-pulse rounded-md bg-neutral-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {header}
        <div className="flex h-48 w-full items-center justify-center text-sm text-neutral-500">
          Failed to load songs.
        </div>
      </div>
    );
  }

  if (!songs.length) return null;

  return (
    <div>
      {header}

      <div
        ref={scrollRef}
        className="mh-scroll flex items-stretch gap-5 overflow-x-auto"
      >
        {songs.map((song) => (
          <div key={song.id} className="w-[220px] shrink-0">
            <Card
              isLikedInitially={song.isLiked}
              isNew={song.isNew}
              song={song}
              onPlay={onPlay}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
