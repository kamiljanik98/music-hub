"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, ProfileSummary } from "@/types";

const SUGGESTION_LIMIT = 4;

export const getSuggestedUsers = async (
  excludeUserId: string,
): Promise<ActionResult<ProfileSummary[]>> => {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const excludeIds = [excludeUserId];
  if (currentUser) {
    excludeIds.push(currentUser.id);
    const { data: following, error: followsError } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUser.id);
    if (followsError) {
      return { data: [], error: followsError };
    }
    excludeIds.push(...(following?.map((f) => f.following_id) ?? []));
  }

  const { data, error: profilesError } = await supabase
    .from("profiles")
    .select("id, nickname, avatar_url")
    .not(
      "id",
      "in",
      `(${excludeIds.map((i) => (/[,()]/.test(i) ? `"${i}"` : i)).join(",")})`,
    )
    .limit(SUGGESTION_LIMIT * 3);

  if (profilesError || !data) return { data: [], error: profilesError };

  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return { data: shuffled.slice(0, SUGGESTION_LIMIT), error: null };
};
