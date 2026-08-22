"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadCover, deleteFromR2 } from "@/lib/r2/upload";
import { validateImageFile, safeImageExtension } from "@/lib/validations/files";
import { revalidatePath } from "next/cache";
import { MutationResult } from "@/types";

export async function updateSongCover(
  id: string,
  file: File,
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
    .select("uploaded_by, image_path")
    .eq("id", id)
    .single();

  if (fetchError || !song) {
    return { error: new Error("Song not found") };
  }

  if (song.uploaded_by !== user.id) {
    return { error: new Error("Not authorized") };
  }

  const oldImagePath = song.image_path;
  const extension = safeImageExtension(file);
  const newImagePath = `${user.id}/${randomUUID()}.${extension}`;

  const { error } = validateImageFile(file);

  if (error) {
    return { error };
  }

  try {
    await uploadCover(file, newImagePath);
  } catch (error) {
    return { error: error as Error };
  }

  const { error: updateError } = await supabase
    .from("songs")
    .update({ image_path: newImagePath })
    .eq("id", id);

  if (updateError) {
    try {
      await deleteFromR2("covers", newImagePath);
    } catch {
      console.error("Orphaned cover after failed DB update:", newImagePath);
    }
    return { error: updateError };
  }

  if (oldImagePath) {
    try {
      await deleteFromR2("covers", oldImagePath);
    } catch {
      console.error(
        "Orphaned old cover after successful update:",
        oldImagePath,
      );
    }
  }

  revalidatePath(`/profile/[nickname]`, "page");
  revalidatePath(`/songs/${id}`);
  return { error: null };
}
