import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

import { Song } from "@/types";

const useGetSongs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    setIsLoading(true);

    const fetchSongs = async () => {
      const { data, error } = await supabaseClient
        .from("audio_files")
        .select("*, profiles(nickname)");

      if (error) {
        console.error("Error fetching songs:", error.message);
        setIsLoading(false);
        return;
      }

      console.log("Fetched songs with profiles:", data);

      setSongs(data ?? []);
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
