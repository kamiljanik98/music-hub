"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "@/modules/player/ui/components/player-content";
import { Song } from "@/types";

const PlayerView = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song as Song);

  if (!song || !songUrl || !player.activeId) {
    return (
      <div className="text-neutral-500 fixed bottom-0 left-0 w-full h-16 bg-neutral-900 text-xs text-center flex items-center justify-center z-50">
        Select a song to start listening...
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-2 right-2 h-16 z-50 bg-neutral-900 rounded-t-lg">
      <PlayerContent key={song.path} song={song} songUrl={songUrl} />
    </div>
  );
};

export default PlayerView;
