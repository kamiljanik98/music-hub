"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

const PLAY_SCAN_LIMIT = 200;

const HISTORY_LIMIT = 50;

export type HistorySong = Song & {
  likesCount: number;
  playedAt: string;
};

export const getPlayHistory = async (
  userId: string,
): Promise<ActionResult<HistorySong[]>> => {
  const supabase = await createClient();

  const { data: plays, error } = await supabase
    .from("plays")
    .select(
      "song_id, played_at, songs!inner(*, profiles!uploaded_by(nickname, avatar_url), likes(count))",
    )
    .eq("user_id", userId)
    .order("played_at", { ascending: false })
    .limit(PLAY_SCAN_LIMIT);

  if (error || !plays) return { data: [], error };

  const counts = new Map<string, number>();
  const playedAt = new Map<string, string>();
  const songs: Song[] = [];

  for (const play of plays) {
    const row = play.songs;
    if (!row || playedAt.has(row.id)) continue;

    const { likes: likeRows, ...song } = row;
    counts.set(song.id, likeRows[0]?.count ?? 0);
    playedAt.set(song.id, play.played_at);
    songs.push(song as Song);

    if (songs.length === HISTORY_LIMIT) break;
  }

  const withIsLiked = await attachIsLiked(supabase, songs);

  return {
    data: withIsLiked.map((song) => ({
      ...song,
      likesCount: counts.get(song.id) ?? 0,
      playedAt: playedAt.get(song.id) ?? "",
    })),
    error: null,
  };
};
