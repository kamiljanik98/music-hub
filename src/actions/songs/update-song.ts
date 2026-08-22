"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import type { TablesUpdate } from "@/types/database.types";
import { revalidatePath } from "next/cache";

type UpdateSongInput = Pick<
  TablesUpdate<"songs">,
  "title" | "bpm" | "scale" | "genre" | "tags" | "description"
>;

export async function updateSong(
  id: string,
  data: UpdateSongInput,
): Promise<MutationResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  const { data: song, error: fetchError } = await supabase
    .from("songs")
    .select("uploaded_by")
    .eq("id", id)
    .single();

  if (fetchError || !song) {
    return { error: new Error("Song not found") };
  }

  if (song.uploaded_by !== user.id) {
    return { error: new Error("Not authorized") };
  }

  const { error } = await supabase.from("songs").update(data).eq("id", id);

  if (error) {
    return { error: new Error(error.message) };
  }

  revalidatePath(`/profile/[nickname]`, "page");
  revalidatePath(`/songs/${id}`);
  return { error: null };
}
