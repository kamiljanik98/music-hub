"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

export type LikedSong = Song & {
  likesCount: number;
};

export const getLikedSongs = async (
  profileUserId: string,
): Promise<ActionResult<LikedSong[]>> => {
  const supabase = await createClient();

  const { data: likes, error } = await supabase
    .from("likes")
    .select(
      "song_id, songs!inner(*, profiles!uploaded_by(nickname, avatar_url), likes(count))",
    )
    .eq("user_id", profileUserId)
    .order("created_at", { ascending: false });

  if (error || !likes) return { data: [], error };

  const rows = likes
    .map((l) => (Array.isArray(l.songs) ? l.songs[0] : l.songs))
    .filter(Boolean);

  const counts = new Map<string, number>();

  const songs = rows.map((row) => {
    const { likes: likeRows, ...song } = row;
    counts.set(song.id, likeRows[0]?.count ?? 0);
    return song as Song;
  });

  const withIsLiked = await attachIsLiked(supabase, songs);

  return {
    data: withIsLiked.map((song) => ({
      ...song,
      likesCount: counts.get(song.id) ?? 0,
    })),
    error: null,
  };
};
