"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

export type FeedSong = Song & {
  likesCount: number;
  stemCount: number;
};

export const getFollowedArtistsSongs = async (): Promise<
  ActionResult<FeedSong[]>
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

  const { data: rows, error } = await supabase
    .from("songs")
    .select("*, profiles!uploaded_by(nickname, avatar_url), likes(count), stems(count)")
    .in("uploaded_by", followedIds)
    .order("created_at", { ascending: false });

  if (error || !rows) return { data: [], error };

  const counts = new Map<string, number>();
  const stemCounts = new Map<string, number>();

  const songs = rows.map((row) => {
    const { likes: likeRows, stems: stemRows, ...song } = row;
    counts.set(song.id, likeRows[0]?.count ?? 0);
    stemCounts.set(song.id, stemRows[0]?.count ?? 0);
    return song as Song;
  });

  const withIsLiked = await attachIsLiked(supabase, songs);

  return {
    data: withIsLiked.map((song) => ({
      ...song,
      likesCount: counts.get(song.id) ?? 0,
      stemCount: stemCounts.get(song.id) ?? 0,
    })),
    error: null,
  };
};
