'use client';

import Player from "@/components/audio/player/Player";
import Library from "@/components/audio/library/Library";
import { getAudioFiles } from "@/hooks/audio/getAudioFiles";
import { usePlayer } from "@/hooks/usePlayer";
import { getAudioUrls } from "@/hooks/audio/getAudioUrls";

const PageContent = () => {
  getAudioFiles();
  const audioFiles = usePlayer((state) => state.audioFiles);
  getAudioUrls(audioFiles);

  return (
    <div className="flex-1 flex flex-col w-full h-auto gap-2 overflow-hidden">
      <Library />
      <Player />
    </div>
  )
}

export default PageContent;