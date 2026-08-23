"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, PlaylistSummary } from "@/types";

export const getUserPlaylists = async (
  ownerId: string,
): Promise<ActionResult<PlaylistSummary[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playlists")
    .select("*, profiles!owner_id(nickname, avatar_url), playlist_songs(count)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [], error };

  return {
    data: data.map(({ playlist_songs: trackRows, ...playlist }) => ({
      ...playlist,
      trackCount: trackRows[0]?.count ?? 0,
    })),
    error: null,
  };
};
