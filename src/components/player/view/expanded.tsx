"use client";

import { ChevronDown } from "lucide-react";

import { TrackInfo } from "../track-info";
import { Controls } from "../controls";
import { Volume } from "../volume";
import { Seekbar } from "../seekbar";
import { RepeatButton } from "../repeat-button";
import { Speed } from "../speed";
import { Song } from "@/types";

type ExpandedViewProps = {
  song: Song;
  onClose: () => void;
};

export const ExpandedView = ({ song, onClose }: ExpandedViewProps) => {
  return (
    <section
      aria-label="Full player"
      className="fixed inset-0 z-50 flex flex-col bg-background p-5 md:hidden"
    >
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
          aria-label="Close full player"
        >
          <ChevronDown className="size-6" />
        </button>

        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Now playing
        </span>

        <div className="size-10" />
      </header>

      <div className="flex flex-1 flex-col justify-center gap-8 py-8">
        <div className="mx-auto aspect-square w-full max-w-sm rounded-xl bg-muted" />

        <TrackInfo song={song} />

        <Seekbar />

        <div className="flex justify-center">
          <Controls />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Speed />
          <Volume />
          <RepeatButton />
        </div>
      </div>
    </section>
  );
};
