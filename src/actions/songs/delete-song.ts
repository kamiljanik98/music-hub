"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteFromR2 } from "@/lib/r2/upload";
import { MutationResult } from "@/types";

export const deleteSong = async (id: string): Promise<MutationResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  const { data: song, error: fetchError } = await supabase
    .from("songs")
    .select("path, image_path, uploaded_by, stems(path)")
    .eq("id", id)
    .single();

  if (fetchError || !song) {
    return { error: new Error("Song not found") };
  }

  if (song.uploaded_by !== user.id) {
    return { error: new Error("Not authorized") };
  }

  const orphanedPaths: string[] = [];

  try {
    await deleteFromR2("songs", song.path);
  } catch (err) {
    console.error(`Failed to delete songs/${song.path}:`, err);
    orphanedPaths.push(`songs/${song.path}`);
  }

  if (song.image_path) {
    try {
      await deleteFromR2("covers", song.image_path);
    } catch (err) {
      console.error(`Failed to delete covers/${song.image_path}:`, err);
      orphanedPaths.push(`covers/${song.image_path}`);
    }
  }

  for (const stem of song.stems ?? []) {
    try {
      await deleteFromR2("stems", stem.path);
    } catch (err) {
      console.error(`Failed to delete stems/${stem.path}:`, err);
      orphanedPaths.push(`stems/${stem.path}`);
    }
  }

  if (orphanedPaths.length > 0) {
    console.error("Orphaned R2 paths after delete failure:", orphanedPaths);
    return { error: new Error("Failed to delete some files, aborted") };
  }

  const { error: deleteSongError } = await supabase
    .from("songs")
    .delete()
    .eq("id", id);

  if (deleteSongError) {
    console.error(
      `Song ${id} has no R2 files but its row survived deletion:`,
      deleteSongError.message,
    );
    return {
      error: new Error(
        "This track's files were removed but the record could not be deleted. Try deleting it again.",
      ),
    };
  }

  revalidatePath(`/profile/[nickname]`, "page");
  return { error: null };
};
