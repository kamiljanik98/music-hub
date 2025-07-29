"use client";

import React from "react";
import Player from "@/components/audio/Player";
import Library from "@/components/audio/Library";
import useGetSongs from "@/hooks/useGetSongs";

const PageContent = () => {
  const { songs } = useGetSongs();
  return (
    <div className="flex-1 flex flex-col w-full h-full gap-2">
      <div className="w-full  min-h-0 overflow-y-auto">
        <Library songs={songs} />
      </div>
      <div className="w-full">
        <Player />
      </div>
    </div>
  );
};

export default PageContent;
