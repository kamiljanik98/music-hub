import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useGetSongs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    setIsLoading(true);

    const fetchSongs = async () => {
      const { data, error } = await supabaseClient.from("audio_files").select("*");

      if (error) {
        setIsLoading(false);
        return console.error(error.message);
      }

      setSongs(data as Song[]);
      setIsLoading(false);
    };

    fetchSongs();
  }, [supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      songs,
    }),
    [isLoading, songs],
  );
};

export default useGetSongs;
