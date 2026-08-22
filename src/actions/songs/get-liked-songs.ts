"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

export const getLikedSongs = async (
  profileUserId: string,
): Promise<ActionResult<Song[]>> => {
  const supabase = await createClient();

  const { data: likes, error } = await supabase
    .from("likes")
    .select(
      "song_id, songs!inner(*, profiles!uploaded_by(nickname, avatar_url))",
    )
    .eq("user_id", profileUserId)
    .order("created_at", { ascending: false });

  if (error || !likes) return { data: [], error };

  const songs = likes
    .map((l) => (Array.isArray(l.songs) ? l.songs[0] : l.songs))
    .filter((s): s is Song => Boolean(s));

  return { data: await attachIsLiked(supabase, songs), error: null };
};
