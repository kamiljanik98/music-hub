"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";

export const recordPlay = async (songId: string): Promise<MutationResult> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: new Error("Not authenticated") };

  const { error } = await supabase.rpc("record_play", { p_song_id: songId });

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
};
