"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, ProfileSummary } from "@/types";

export const getFollowedUsers = async (
  userId: string,
): Promise<ActionResult<ProfileSummary[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select("profiles!following_id(id, nickname, avatar_url)")
    .eq("follower_id", userId);

  if (error || !data) return { data: [], error };

  const profiles = data
    .map((f) => (Array.isArray(f.profiles) ? f.profiles[0] : f.profiles))
    .filter((p): p is ProfileSummary => Boolean(p));

  return { data: profiles, error: null };
};
