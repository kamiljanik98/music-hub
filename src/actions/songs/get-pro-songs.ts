"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";
import type { FeedSong } from "./get-followed-artists-songs";

const PRO_ROLES = ["pro", "admin"];

const PRO_FEED_LIMIT = 24;

export const getProSongs = async (): Promise<ActionResult<FeedSong[]>> => {
  const supabase = await createClient();

  const { data: pros, error: prosError } = await supabase
    .from("profiles")
    .select("id")
    .in("role", PRO_ROLES);

  if (prosError) return { data: [], error: prosError };

  const proIds = pros?.map((p) => p.id) ?? [];
  if (proIds.length === 0) return { data: [], error: null };

  const { data: rows, error } = await supabase
    .from("songs")
    .select("*, profiles!uploaded_by(nickname, avatar_url), likes(count), stems(count)")
    .in("uploaded_by", proIds)
    .order("created_at", { ascending: false })
    .limit(PRO_FEED_LIMIT);

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
