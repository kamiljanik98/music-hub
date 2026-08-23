"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Playlist } from "@/types";
import { playlistSchema } from "@/lib/validations/playlist";
import { revalidatePath } from "next/cache";

type CreatePlaylistInput = {
  title: string;
  description?: string;
  isPublic: boolean;
};

export const createPlaylist = async (
  input: CreatePlaylistInput,
): Promise<ActionResult<Playlist | null>> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: new Error("Not authenticated") };

  const parsed = playlistSchema.safeParse(input);

  if (!parsed.success) {
    return { data: null, error: new Error(parsed.error.issues[0].message) };
  }

  const { data, error } = await supabase
    .from("playlists")
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      is_public: parsed.data.isPublic,
    })
    .select("*, profiles!owner_id(nickname, avatar_url)")
    .single();

  if (error) return { data: null, error: new Error(error.message) };

  revalidatePath("/profile/[nickname]/playlists", "page");

  return { data, error: null };
};
