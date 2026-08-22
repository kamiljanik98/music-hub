"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";
import { revalidatePath } from "next/cache";

export const followUser = async (
  targetUserId: string,
): Promise<MutationResult> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: new Error("Not authenticated") };
  if (user.id === targetUserId)
    return { error: new Error("Cannot follow yourself") };

  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, following_id: targetUserId });

  if (error) {
    return { error: new Error(error.message) };
  }

  revalidatePath(`/profile/[nickname]/following`, "page");
  revalidatePath(`/profile/[nickname]/followers`, "page");
  revalidatePath(`/feed`);
  revalidatePath(`/profile/[nickname]`, "page");

  return { error: null };
};
