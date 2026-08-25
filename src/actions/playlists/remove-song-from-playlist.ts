"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import { revalidatePath } from "next/cache";

export const removeSongFromPlaylist = async (
  playlistId: string,
  songId: string,
): Promise<MutationResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  if (error) return { error: new Error(error.message) };

  revalidatePath("/profile/[nickname]/playlists", "page");

  return { error: null };
};
