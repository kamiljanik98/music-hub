import { getFollowedArtistsSongs } from "@/actions/songs/get-followed-artists-songs";
import { getProSongs } from "@/actions/songs/get-pro-songs";
import { ProfileList } from "@/components/social/profile-list";
import { createClient } from "@/lib/supabase/server";
import { FeedPosts } from "./components/feed-posts";
import { AuthGate } from "@/components/auth/auth-gate";
import { getSuggestedUsers } from "@/actions/social/get-suggested-users";

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return <AuthGate message="Sign in to see songs from artists you follow." />;
  }

  const [
    { data: followedSongs, error: followedArtistsSongsError },
    { data: suggestedUsers, error: suggestedUsersError },
  ] = await Promise.all([
    getFollowedArtistsSongs(),
    getSuggestedUsers(currentUser.id),
  ]);

  if (followedArtistsSongsError) {
    return (
      <p className="text-destructive">
        Failed to load your followed artists&apos; songs.
      </p>
    );
  }

  const isProFallback = followedSongs.length === 0;

  const { data: proSongs, error: proSongsError } = isProFallback
    ? await getProSongs()
    : { data: [], error: null };

  if (isProFallback && proSongsError) {
    return <p className="text-destructive">Failed to load featured tracks.</p>;
  }

  const songs = isProFallback ? proSongs : followedSongs;

  const artistCount = new Set(songs.map((song) => song.uploaded_by)).size;

  return (
    <div className="flex w-full items-start gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {songs.length ? (
          <FeedPosts
            songs={songs}
            eyebrow={
              isProFallback
                ? `FEED / ${artistCount} FEATURED ${artistCount === 1 ? "ARTIST" : "ARTISTS"}`
                : `FEED / ${artistCount} ${artistCount === 1 ? "ARTIST" : "ARTISTS"} YOU FOLLOW`
            }
            note={
              isProFallback
                ? "You're not following anyone yet — here's what our featured artists are posting."
                : undefined
            }
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Nothing to show here yet.
          </p>
        )}
      </div>

      <aside className="sticky top-28 mt-10 hidden w-[320px] shrink-0 self-start lg:block">
        {suggestedUsersError ? (
          <p className="text-destructive">
            Failed to load your suggested artists list.
          </p>
        ) : (
          <ProfileList title="Suggested Users for You" users={suggestedUsers} />
        )}
      </aside>
    </div>
  );
}
