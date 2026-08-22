"use server";

import { createClient } from "@/lib/supabase/server";
import { attachIsLiked } from "@/lib/attach-is-liked";
import { ActionResult, Song } from "@/types";

export const getSongById = async (
  id: string,
): Promise<ActionResult<Song | null>> => {
  const supabase = await createClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select(`*, profiles!uploaded_by(nickname, avatar_url), stems(*)`)
    .eq("id", id)
    .single();

  if (error || !song) return { data: null, error };

  return { data: (await attachIsLiked(supabase, [song]))[0], error: null };
};
