"use client";

import { Song } from "@/types";
import { Controls } from "../controls";
import { TrackInfo } from "../track-info";

type CompactViewProps = {
  song: Song;
  onExpand: () => void;
};

export const CompactView = ({ song, onExpand }: CompactViewProps) => {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 rounded-lg border border-white/12 bg-[rgba(23,23,23,0.72)] p-3 mh-glass">
      <div className="flex items-center gap-3">
        <div
          onClick={onExpand}
          className="min-w-0 flex-1 cursor-pointer text-left"
          aria-label="Open full player"
        >
          <TrackInfo song={song} />
        </div>

        <Controls />
      </div>
    </div>
  );
};
