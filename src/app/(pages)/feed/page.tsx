import { getFollowedArtistsSongs } from "@/actions/songs/get-followed-artists-songs";
import { ProfileList } from "@/components/social/profile-list";
import { createClient } from "@/lib/supabase/server";
import { SongList } from "./components/song-list";
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

  const { data: songs, error: followedArtistsSongsError } =
    await getFollowedArtistsSongs();

  if (followedArtistsSongsError) {
    return (
      <p className="text-destructive">
        Failed to load your followed artists&apos; songs.
      </p>
    );
  }

  if (songs.length === 0) {
    const { data: users, error: suggestedUsersError } = await getSuggestedUsers(
      currentUser.id,
    );

    return (
      <div>
        <p className="text-muted-foreground">
          You&apos;re not following anyone yet — follow some artists to see
          their tracks here.
        </p>

        {suggestedUsersError ? (
          <p className="text-destructive">
            Failed to load your suggested artists list.
          </p>
        ) : (
          <ProfileList title="Suggested Users for You" users={users} />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      <SongList songs={songs} />
    </div>
  );
}
