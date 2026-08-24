"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, ProfileSummary } from "@/types";

type FollowedProfile = ProfileSummary & {
  followerCount: number;
  trackCount: number;
};

export const getFollowedUsers = async (
  userId: string,
): Promise<ActionResult<FollowedProfile[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select(
      "profiles!following_id(id, nickname, avatar_url, followers:follows!following_id(count), songs(count))",
    )
    .eq("follower_id", userId);

  if (error || !data) return { data: [], error };

  const profiles = data
    .map((f) => (Array.isArray(f.profiles) ? f.profiles[0] : f.profiles))
    .filter(Boolean)
    .map(({ followers, songs, ...profile }) => ({
      ...profile,
      followerCount: followers[0]?.count ?? 0,
      trackCount: songs[0]?.count ?? 0,
    }));

  return { data: profiles, error: null };
};
