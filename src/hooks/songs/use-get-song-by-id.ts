"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Song } from "@/types";

export function useGetSongById(id: string | null) {
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const fetchSong = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("songs")
        .select("*, profiles!uploaded_by(nickname, avatar_url)")
        .eq("id", id)
        .single();

      if (cancelled) return;

      setSong(data);
      setError(error);
      setIsLoading(false);
    };

    fetchSong();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { song: id ? song : null, isLoading, error };
}
