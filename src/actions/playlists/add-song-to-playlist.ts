"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import { revalidatePath } from "next/cache";

export const addSongToPlaylist = async (
  playlistId: string,
  songId: string,
): Promise<MutationResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: new Error("Not authenticated") };

  const { data: last, error: lastError } = await supabase
    .from("playlist_songs")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastError) return { error: new Error(lastError.message) };

  const { error } = await supabase.from("playlist_songs").insert({
    playlist_id: playlistId,
    song_id: songId,
    position: (last?.position ?? -1) + 1,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: new Error("Already in this playlist") };
    }

    return { error: new Error(error.message) };
  }

  revalidatePath(`/playlists/${playlistId}`);
  revalidatePath("/profile/[nickname]/playlists", "page");

  return { error: null };
};
