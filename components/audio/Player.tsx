'use client';

import useGetSongById from '@/hooks/useGetSongById';
import useLoadSongUrl from '@/hooks/useLoadSongUrl';
import usePlayer from '@/hooks/usePlayer';
import PlayerContent from './PlayerContent';
import { Song } from '@/types';

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song as Song);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="bottom-0 bg-neutral-900 rounded-lg w-full py-2 h-[80px] px-4">
      <PlayerContent key={song.path} song={song} songUrl={songUrl} />
    </div>
  );
};

export default Player;
