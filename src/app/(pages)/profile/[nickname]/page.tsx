import { getUserSongs } from "@/actions/songs/get-user-songs";
import { TrackList } from "@/components/profile/track-list";
import { EditProfileDialog } from "@/components/profile/edit/edit-profile-dialog";
import { getAvatarUrl } from "@/lib/r2/public";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import { FollowButton } from "@/components/social/follow-button";
import { ProfileList } from "@/components/social/profile-list";
import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getFollowStatus } from "@/actions/social/get-follow-status";
import { getLikedSongs } from "@/actions/songs/get-liked-songs";
import { SongList } from "@/components/songs/song-list";
import { getSuggestedUsers } from "@/actions/social/get-suggested-users";

type ProfilePageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { nickname } = await params;
  const { data: profile, error: profileError } =
    await getProfileByNickname(nickname);

  const supabase = await createClient();

  if (profileError) {
    return <p className="text-destructive">Failed to load profile</p>;
  }

  if (!profile) {
    return notFound();
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwnProfile = currentUser?.id === profile.id;

  const [{ data: songs }, likedSongs, { data: isFollowing }] =
    await Promise.all([
      getUserSongs(profile.id),
      getLikedSongs(profile.id),
      isOwnProfile
        ? Promise.resolve({ data: false, error: null })
        : getFollowStatus(profile.id),
    ]);

  const { data: users, error: suggestedUsersError } = await getSuggestedUsers(
    profile.id,
  );

  return (
    <div className="px-6 py-10">
      {/* Header */}
      <header className="flex items-center gap-6">
        <Image
          src={getAvatarUrl(profile.avatar_url)}
          alt={profile.nickname ?? "User Avatar"}
          width={96}
          height={96}
          className="size-24 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {profile.nickname}
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Since {profile.created_at.slice(0, 4)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isOwnProfile ? (
            <EditProfileDialog />
          ) : (
            <>
              <FollowButton
                profileUserId={profile.id}
                isFollowingInitially={isFollowing}
              />
              <CopyLinkButton path={`/profile/${profile.nickname}`} />
            </>
          )}
        </div>
      </header>

      {/* Stats */}
      <div className="mt-8 flex items-center gap-8 border-y border-border py-5">
        <div>
          <p className="text-lg font-semibold">{songs.length}</p>
          <p className="text-xs text-muted-foreground">Tracks</p>
        </div>

        <div>
          <p className="text-lg font-semibold">{likedSongs.data.length}</p>
          <p className="text-xs text-muted-foreground">Likes</p>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <section className="mt-8 max-w-2xl">
          <h2 className="mb-2 text-sm font-semibold">Bio</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {profile.bio}
          </p>
        </section>
      )}

      {/* Content */}
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_18rem] gap-10">
        {/* Tracks */}
        <section className="min-w-0">
          <h2 className="mb-4 text-lg font-semibold text-neutral-100">
            Tracks
          </h2>

          <TrackList songs={songs} />
        </section>

        {/* Likes + suggestions */}
        <aside className="flex flex-col gap-8">
          {likedSongs.error && (
            <p className="text-sm text-destructive">
              Failed to fetch liked songs
            </p>
          )}

          {likedSongs.data.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                Likes
              </h2>

              <SongList songs={likedSongs.data} />
            </section>
          )}

          {suggestedUsersError ? (
            <p className="text-sm text-destructive">
              Failed to fetch suggested users
            </p>
          ) : (
            <ProfileList title="Suggested Users for You" users={users} />
          )}
        </aside>
      </div>
    </div>
  );
}
