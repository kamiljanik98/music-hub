"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import { revalidatePath } from "next/cache";

export const likeSong = async (songId: string): Promise<MutationResult> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("likes")
    .insert({ user_id: user.id, song_id: songId });

  if (error) {
    return { error: new Error(error.message) };
  }

  revalidatePath(`/profile/[nickname]/likes`, "page");
  revalidatePath(`/search`);
  revalidatePath(`/songs/${songId}`);
  revalidatePath(`/profile/[nickname]`, "page");

  return { error: null };
};
