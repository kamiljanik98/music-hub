"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types";

export const getFollowStatus = async (
  targetUserId: string,
): Promise<ActionResult<boolean>> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: false, error: null };

  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (error) {
    return { data: false, error: new Error(error.message) };
  }

  return { data: !!data, error: null };
};
