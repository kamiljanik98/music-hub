"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

export const getFollowedArtistsSongs = async (): Promise<
  ActionResult<Song[]>
> => {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { data: [], error: null };
  }

  const { data: follows, error: followsError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUser.id);

  if (followsError) return { data: [], error: followsError };

  const followedIds = follows?.map((f) => f.following_id) ?? [];
  if (followedIds.length === 0) return { data: [], error: null };

  const { data: songs, error } = await supabase
    .from("songs")
    .select("*, profiles!uploaded_by(nickname, avatar_url)")
    .in("uploaded_by", followedIds)
    .order("created_at", { ascending: false });

  if (error || !songs) return { data: [], error };

  return { data: await attachIsLiked(supabase, songs), error: null };
};
