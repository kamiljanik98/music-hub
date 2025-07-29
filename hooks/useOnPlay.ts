import usePlayer from "./usePlayer";
// import { useUser } from "../useUser";
import { Song } from "@/types";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  // const { user } = useUser();

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(songs.map((song) => String(song.id)));
  };
  return onPlay;
};

export default useOnPlay;
