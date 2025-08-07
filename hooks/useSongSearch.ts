import { useEffect, useState } from "react";
import { Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import useDebounce from "@/hooks/useDebounce";

const useSongSearch = (query: string) => {
  const supabase = createClientComponentClient<Database>();
  const debouncedQuery = useDebounce(query, 500);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from("audio_files")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(15);

        if (error) throw error;
        setSongs(data as Song[]);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSongs([]);
      }
    };

    const searchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from("audio_files")
          .select("*")
          .ilike("title", `%${debouncedQuery}%`)
          .order("created_at", { ascending: false })
          .limit(15);

        if (error) throw error;
        setSongs(data as Song[]);
      } catch (error) {
        console.error("Error searching songs:", error);
        setSongs([]);
      }
    };

    if (!debouncedQuery) {
      fetchSongs();
    } else {
      searchSongs();
    }
  }, [debouncedQuery, supabase]);

  return songs;
};

export default useSongSearch;
