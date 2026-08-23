"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import { revalidatePath } from "next/cache";

export const deletePlaylist = async (
  playlistId: string,
): Promise<MutationResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId)
    .eq("owner_id", user.id);

  if (error) return { error: new Error(error.message) };

  revalidatePath("/profile/[nickname]/playlists", "page");

  return { error: null };
};
