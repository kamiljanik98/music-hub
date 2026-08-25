import usePlayer from "@/hooks/player/use-player";
import type { Song } from "@/types";
import { useCallback } from "react";

export function useOnPlay(songs: Song[]) {
  const activeId = usePlayer((state) => state.activeId);
  const setActiveId = usePlayer((state) => state.setActiveId);
  const setIds = usePlayer((state) => state.setIds);
  const requestPlayPause = usePlayer((state) => state.requestPlayPause);

  const onPlay = useCallback(
    (id: string) => {
      if (id === activeId) {
        return requestPlayPause();
      } else {
        setIds(songs.map((song) => song.id));
        setActiveId(id);
      }
    },
    [songs, activeId, requestPlayPause, setIds, setActiveId],
  );

  return onPlay;
}
