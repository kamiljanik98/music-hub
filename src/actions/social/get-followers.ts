"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, ProfileSummary } from "@/types";

type FollowerProfile = ProfileSummary & {
  followerCount: number;
  trackCount: number;
  isFollowing: boolean;
  isSelf: boolean;
};

export const getFollowers = async (
  userId: string,
): Promise<ActionResult<FollowerProfile[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select(
      "profiles!follower_id(id, nickname, avatar_url, followers:follows!following_id(count), songs(count))",
    )
    .eq("following_id", userId);

  if (error || !data) return { data: [], error };

  const profiles = data
    .map((f) => (Array.isArray(f.profiles) ? f.profiles[0] : f.profiles))
    .filter(Boolean)
    .map(({ followers, songs, ...profile }) => ({
      ...profile,
      followerCount: followers[0]?.count ?? 0,
      trackCount: songs[0]?.count ?? 0,
    }));

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser || profiles.length === 0) {
    return {
      data: profiles.map((profile) => ({
        ...profile,
        isFollowing: false,
        isSelf: false,
      })),
      error: null,
    };
  }

  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUser.id)
    .in(
      "following_id",
      profiles.map((profile) => profile.id),
    );

  const followedIds = new Set(follows?.map((f) => f.following_id));

  return {
    data: profiles.map((profile) => ({
      ...profile,
      isFollowing: followedIds.has(profile.id),
      isSelf: profile.id === currentUser.id,
    })),
    error: null,
  };
};
