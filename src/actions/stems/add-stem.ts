"use server";

import { uploadStem, deleteFromR2 } from "@/lib/r2/upload";
import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import { Database } from "@/types/database.types";
import { revalidatePath } from "next/cache";

type StemCategory = Database["public"]["Enums"]["stem_category"];

export const addStem = async (
  songId: string,
  file: File,
  category: StemCategory,
): Promise<MutationResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  const { data: song, error: songError } = await supabase
    .from("songs")
    .select("uploaded_by")
    .eq("id", songId)
    .single();

  if (songError || !song) {
    return { error: new Error("Song not found") };
  }

  if (song.uploaded_by !== user.id) {
    return { error: new Error("Not authorized to modify this song") };
  }

  const path = `${user.id}/${songId}/${crypto.randomUUID()}.${file.name.split(".").pop()}`;

  try {
    await uploadStem(file, path);
  } catch {
    return { error: new Error("Failed to upload stem file") };
  }

  const { error: insertError } = await supabase.from("stems").insert({
    song_id: songId,
    category,
    path,
  });

  if (insertError) {
    try {
      await deleteFromR2("stems", path);
    } catch {
      console.error("Orphaned stem after failed DB insert:", path);
    }
    return { error: insertError };
  }

  revalidatePath(`/songs/${songId}`);
  return { error: null };
};
