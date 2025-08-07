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
      <div className="relative py-6 bg-neutral-900 rounded-lg text-xs text-center">
        Select a song to start listening...
      </div>
    );
  }

  return <PlayerContent key={song.path} song={song} songUrl={songUrl} />;
};

export default PlayerView;
