"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import useUser from "@/hooks/profile/use-user";
import type { Tables } from "@/types/database.types";

type MyPlaylist = Pick<Tables<"playlists">, "id" | "title">;

export function useMyPlaylists() {
  const user = useUser((state) => state.user);
  const [playlists, setPlaylists] = useState<MyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setPlaylists([]);
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("playlists")
      .select("id, title")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    setPlaylists(data ?? []);
    setError(error);
    setIsLoading(false);
  }, [user]);

  return { playlists, isLoading, error, load };
}
