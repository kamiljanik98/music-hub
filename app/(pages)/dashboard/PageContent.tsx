"use client";

import React from "react";
import Player from "@/components/audio/Player";
import Library from "@/components/audio/Library";
import useGetSongs from "@/hooks/useGetSongs";

const PageContent = () => {
  const { songs } = useGetSongs();
  return (
    <div className="flex-1 flex flex-col w-full h-auto gap-2 overflow-hidden">
      <Library songs={songs} />
      <Player />
    </div>
  );
};

export default PageContent;
