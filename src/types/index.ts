import type { Tables } from "@/types/database.types";

export type Stem = Tables<"stems">;

export type Song = Tables<"songs"> & {
  stems?: Stem[];
  isLiked?: boolean;
  profiles: Pick<Tables<"profiles">, "nickname" | "avatar_url"> | null;
};

export type UserProfile = Tables<"profiles">;

export type Playlist = Tables<"playlists"> & {
  profiles: Pick<Tables<"profiles">, "nickname" | "avatar_url"> | null;
};

export type PlaylistSummary = Playlist & {
  trackCount: number;
};

export type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export type ProfileSummary = Pick<
  UserProfile,
  "id" | "nickname" | "avatar_url"
>;

export type ActionResult<T> = { data: T; error: Error | null };
export type MutationResult = { error: Error | null };
