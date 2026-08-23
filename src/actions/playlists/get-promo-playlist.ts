"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types";
import { getPlaylistById } from "./get-playlist-by-id";
import type { PlaylistDetails } from "./get-playlist-by-id";

const PROMO_ROLES = ["pro", "admin"];

export const getPromoPlaylist = async (): Promise<
  ActionResult<PlaylistDetails | null>
> => {
  const supabase = await createClient();

  const promoId = process.env.NEXT_PUBLIC_PROMO_PLAYLIST_ID;

  if (promoId) return getPlaylistById(promoId);

  const { data: promoters, error: promotersError } = await supabase
    .from("profiles")
    .select("id")
    .in("role", PROMO_ROLES);

  if (promotersError) return { data: null, error: promotersError };

  const promoterIds = promoters?.map((promoter) => promoter.id) ?? [];
  if (promoterIds.length === 0) return { data: null, error: null };

  const { data: playlists, error } = await supabase
    .from("playlists")
    .select("id, playlist_songs(count)")
    .in("owner_id", promoterIds)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: new Error(error.message) };

  const playlist = playlists?.find(
    (candidate) => (candidate.playlist_songs[0]?.count ?? 0) > 0,
  );

  if (!playlist) return { data: null, error: null };

  return getPlaylistById(playlist.id);
};
