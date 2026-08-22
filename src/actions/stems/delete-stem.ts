"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteFromR2 } from "@/lib/r2/upload";
import { MutationResult } from "@/types";

export const deleteStem = async (stemId: string): Promise<MutationResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  const { data: stem, error: stemError } = await supabase
    .from("stems")
    .select("path, song_id, songs!inner(uploaded_by)")
    .eq("id", stemId)
    .single();

  if (stemError || !stem) {
    return { error: new Error("Stem not found") };
  }

  if (stem.songs.uploaded_by !== user.id) {
    return { error: new Error("Not authorized to delete this stem") };
  }

  try {
    await deleteFromR2("stems", stem.path);
  } catch (err) {
    console.error(`Failed to delete stems/${stem.path}:`, err);
    return { error: new Error("Failed to delete stem file - aborted") };
  }

  const { error: deleteError } = await supabase
    .from("stems")
    .delete()
    .eq("id", stemId);

  if (deleteError) {
    return {
      error: new Error(
        "File deleted from storage but DB record removal failed - orphaned record",
      ),
    };
  }

  revalidatePath(`/songs/${stem.song_id}`);
  return { error: null };
};
