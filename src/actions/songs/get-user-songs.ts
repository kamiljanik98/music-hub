"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

export async function getUserSongs(
  userId: string,
): Promise<ActionResult<Song[]>> {
  const supabase = await createClient();

  const { data: songs, error } = await supabase
    .from("songs")
    .select("*, profiles!uploaded_by(nickname, avatar_url)")
    .eq("uploaded_by", userId);

  if (error || !songs) {
    return {
      data: [],
      error: new Error(error?.message ?? "Failed to load songs"),
    };
  }

  return { data: await attachIsLiked(supabase, songs), error: null };
}
