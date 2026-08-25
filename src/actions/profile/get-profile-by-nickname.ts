"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, UserProfile } from "@/types";

type ProfileDetails = Pick<
  UserProfile,
  | "id"
  | "nickname"
  | "avatar_url"
  | "banner_url"
  | "bio"
  | "created_at"
  | "social_links"
>;

const decodeNickname = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const getProfileByNickname = async (
  nickname: string,
): Promise<ActionResult<ProfileDetails | null>> => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, nickname, avatar_url, banner_url, bio, created_at, social_links",
    )
    .eq("nickname", decodeNickname(nickname).toLowerCase())
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: profile, error };
};
