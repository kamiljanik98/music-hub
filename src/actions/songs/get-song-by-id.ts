"use server";

import { createClient } from "@/lib/supabase/server";
import { attachIsLiked } from "@/lib/attach-is-liked";
import { ActionResult, Song } from "@/types";

type SongDetails = Song & {
  likesCount: number;
};

export const getSongById = async (
  id: string,
): Promise<ActionResult<SongDetails | null>> => {
  const supabase = await createClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select(
      `*, profiles!uploaded_by(nickname, avatar_url), stems(*), likes(count)`,
    )
    .eq("id", id)
    .single();

  if (error || !song) return { data: null, error };

  const { likes, ...rest } = song;
  const [songWithIsLiked] = await attachIsLiked(supabase, [rest]);

  return {
    data: { ...songWithIsLiked, likesCount: likes[0]?.count ?? 0 },
    error: null,
  };
};
