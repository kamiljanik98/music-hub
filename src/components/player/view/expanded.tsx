"use client";

import { ChevronDown } from "lucide-react";

import { Song } from "@/types";
import { getCoverUrl } from "@/lib/r2/public";

import { TrackInfo } from "../track-info";
import { Controls } from "../controls";
import { Volume } from "../volume";
import { Seekbar } from "../seekbar";
import { RepeatButton } from "../repeat-button";
import { Speed } from "../speed";

type ExpandedViewProps = {
  song: Song;
  onClose: () => void;
};

export const ExpandedView = ({ song, onClose }: ExpandedViewProps) => {
  return (
    <section
      aria-label="Full player"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-6 pb-8 pt-4 md:hidden"
    >
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Close full player"
        >
          <ChevronDown className="size-6" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Now playing
          </p>
          <p className="mt-0.5 text-xs text-foreground/80">Music Hub</p>
        </div>

        <div className="size-11" />
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 py-8">
        <div className="relative mx-auto aspect-square w-full max-w-[min(80vw,360px)]">
          <div className="absolute inset-4 rounded-2xl bg-primary/10 blur-2xl" />

          <div className="relative size-full overflow-hidden rounded-2xl bg-muted shadow-2xl">
            {song.image_path ? (
              <img
                src={getCoverUrl(song.image_path)}
                alt={`Cover of ${song.title}`}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                No cover available
              </div>
            )}
          </div>
        </div>

        <TrackInfo song={song} />

        <div className="space-y-3">
          <Seekbar />
        </div>

        <Controls />

        <div className="flex items-center justify-center gap-8 border-t border-border/60 pt-5">
          <Speed />
          <Volume />
          <RepeatButton />
        </div>
      </div>
    </section>
  );
};
