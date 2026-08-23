"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, Playlist, Song } from "@/types";
import { attachIsLiked } from "@/lib/attach-is-liked";

export type PlaylistTrack = Song & {
  likesCount: number;
  position: number;
};

export type PlaylistDetails = {
  playlist: Playlist;
  tracks: PlaylistTrack[];
};

export const getPlaylistById = async (
  playlistId: string,
): Promise<ActionResult<PlaylistDetails | null>> => {
  const supabase = await createClient();

  const { data: playlist, error: playlistError } = await supabase
    .from("playlists")
    .select("*, profiles!owner_id(nickname, avatar_url)")
    .eq("id", playlistId)
    .maybeSingle();

  if (playlistError) {
    return { data: null, error: new Error(playlistError.message) };
  }

  if (!playlist) return { data: null, error: null };

  const { data: rows, error } = await supabase
    .from("playlist_songs")
    .select(
      "position, songs!inner(*, profiles!uploaded_by(nickname, avatar_url), likes(count))",
    )
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (error) return { data: null, error: new Error(error.message) };

  const counts = new Map<string, number>();
  const positions = new Map<string, number>();

  const songs = (rows ?? []).map((row) => {
    const { likes: likeRows, ...song } = row.songs;
    counts.set(song.id, likeRows[0]?.count ?? 0);
    positions.set(song.id, row.position);
    return song as Song;
  });

  const withIsLiked = await attachIsLiked(supabase, songs);

  return {
    data: {
      playlist,
      tracks: withIsLiked.map((song) => ({
        ...song,
        likesCount: counts.get(song.id) ?? 0,
        position: positions.get(song.id) ?? 0,
      })),
    },
    error: null,
  };
};
