import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("audio_files")
        .select("*, profiles(nickname)")
        .eq("id", id)
        .single();

      if (error) {
        setIsLoading(false);
        console.error("Error fetching song by id:", error.message);
        return;
      }

      console.log("Fetched single song with profile:", data);

      setSong(data as Song);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song],
  );
};

export default useGetSongById;
