"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

const SEARCH_LIMIT = 24;

export const getSearchedSongs = async (
  query?: string,
  limit: number = SEARCH_LIMIT,
): Promise<ActionResult<Song[]>> => {
  const supabase = await createClient();

  if (!query?.trim() || limit <= 0) return { data: [], error: null };

  const escapedTitle = query?.replace(/"/g, '\\"');
  const pattern = `"%${escapedTitle}%"`;

  const [byField, byTag] = await Promise.all([
    supabase
      .from("songs")
      .select("*, profiles!uploaded_by(nickname, avatar_url)")
      .order("created_at", { ascending: false })
      .or(
        `title.ilike.${pattern},genre.ilike.${pattern},scale.ilike.${pattern}`,
      )
      .limit(limit),
    supabase
      .from("songs")
      .select("*, profiles!uploaded_by(nickname, avatar_url)")
      .order("created_at", { ascending: false })
      .contains("tags", [query])
      .limit(limit),
  ]);

  if (byField.error) return { data: [], error: byField.error };
  if (byTag.error) return { data: [], error: byTag.error };

  const merged = [...byField.data, ...byTag.data];
  const deduped = Array.from(
    new Map(merged.map((s) => [s.id, s])).values(),
  ).slice(0, limit);

  return { data: await attachIsLiked(supabase, deduped), error: null };
};
