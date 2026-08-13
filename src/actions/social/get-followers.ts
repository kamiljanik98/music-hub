"use server";

import { createClient } from "@/lib/supabase/server";
import { ProfileSummary } from "@/types";

type GetFollowersResult = { data: ProfileSummary[]; error: Error | null };

export const getFollowers = async (
  userId: string,
): Promise<GetFollowersResult> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select("profiles!follower_id(id, nickname, avatar_url)")
    .eq("following_id", userId);

  if (error || !data) return { data: [], error };

  const profiles = data
    .map((f) => (Array.isArray(f.profiles) ? f.profiles[0] : f.profiles))
    .filter((p): p is ProfileSummary => Boolean(p));

  return { data: profiles, error: null };
};
