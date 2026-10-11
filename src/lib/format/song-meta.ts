import { Song } from "@/types";

type SongMeta = Pick<
  Song,
  | "description"
  | "genre"
  | "scale"
  | "bpm"
  | "tags"
  | "created_at"
  | "play_count"
>;

export function getSongMeta(song: SongMeta) {
  return {
    description: song.description,
    genre: song.genre,
    scale: song.scale,
    bpm: song.bpm,
    tags: song.tags,
    createdAt: song.created_at,
    plays: song.play_count,
  };
}

export function formatSongMeta(
  song: Pick<Song, "bpm" | "scale" | "genre">,
): string {
  return [song.bpm && `${song.bpm} BPM`, song.scale, song.genre]
    .filter(Boolean)
    .join(" · ");
}
