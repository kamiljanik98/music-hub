"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const unfollowUser = async (targetUserId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId);

  if (error) {
    return { error: new Error(error.message) };
  }

  revalidatePath(`/profile/[nickname]/following`, "page");
  revalidatePath(`/profile/[nickname]/followers`, "page");
  revalidatePath(`/feed`);
  revalidatePath(`/profile/[nickname]`, "page");

  return { error: null };
};
