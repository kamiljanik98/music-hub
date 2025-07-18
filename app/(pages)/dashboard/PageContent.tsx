'use client';

import Player from "@/components/player/Player";
import Library from "@/components/audio/Library";

const PageContent = () => {
  return (
    <div className="flex-1 flex flex-col w-full h-auto gap-2 overflow-hidden">
      <Library />
      <Player />
    </div>
  )
}

export default PageContent;