"use client";

import React from "react";
import Player from "@/components/audio/Player";
import Library from "@/components/audio/Library";
import useGetSongs from "@/hooks/useGetSongs";
import usePlayer from "@/hooks/usePlayer";
import { truncateText } from "@/utils/truncate";

export default function View() {
  const { songs } = useGetSongs();
  const player = usePlayer();

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 md:pb-0">
        <Library songs={songs} />
      </div>

      <div
        className="
          md:bottom-4 right-0 left-0 pr-4 md:p-0 h-20 bg-neutral-900 z-50 flex-shrink-0 
          bottom-0 fixed md:relative md:h-auto md:w-full
          flex md:rounded-md items-center justify-between
        "
      >
        {player.activeId ? (
          <Player />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-neutral-500 md:hidden">
            Select a song to play
          </div>
        )}
      </div>
    </div>
  );
}
