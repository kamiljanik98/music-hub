import { getUserSongs } from "@/actions/songs/get-user-songs";
import { TrackList } from "@/components/profile/track-list";
import { EditProfileDialog } from "@/components/profile/edit/edit-profile-dialog";
import { getAvatarUrl, getBannerUrl } from "@/lib/r2/public";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import { FollowButton } from "@/components/social/follow-button";
import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getFollowStatus } from "@/actions/social/get-follow-status";
import { getFollowers } from "@/actions/social/get-followers";
import { getFollowedUsers } from "@/actions/social/get-followed-users";
import { SocialLinks } from "@/components/profile/social-links";
import { ProfileBio } from "./components/profile-bio";
import { EditableAvatar } from "@/components/profile/edit/editable-avatar";
import { EditableBanner } from "@/components/profile/edit/editable-banner";
import type { SocialLinks as SocialLinksValue } from "@/lib/validations/profile";

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

  const [
    { data: songs },
    { data: isFollowing },
    { data: followers },
    { data: following },
  ] = await Promise.all([
    getUserSongs(profile.id),
    isOwnProfile
      ? Promise.resolve({ data: false, error: null })
      : getFollowStatus(profile.id),
    getFollowers(profile.id),
    getFollowedUsers(profile.id),
  ]);

  const bannerUrl = getBannerUrl(profile.banner_url);

  return (
    <div className="pb-16">
      {/* Banner */}
      <div className="relative left-1/2 -mt-24 h-60 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(120deg,rgba(168,85,247,0.35),rgba(214,242,75,0.22))] md:h-72">
        {isOwnProfile ? (
          <EditableBanner
            bannerUrl={bannerUrl}
            nickname={profile.nickname ?? "User"}
          />
        ) : (
          bannerUrl && (
            <Image
              src={bannerUrl}
              alt={`${profile.nickname ?? "User"} banner`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.55)_55%,var(--mh-ink)_100%)]" />

        <div className="absolute right-6 bottom-4 z-10 flex items-center gap-3">
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
      </div>

      {/* Identity */}
      <header className="relative -mt-14 flex flex-wrap items-end gap-x-6 gap-y-4">
        {isOwnProfile ? (
          <EditableAvatar
            avatarPath={profile.avatar_url}
            nickname={profile.nickname ?? "User Avatar"}
          />
        ) : (
          <Image
            src={getAvatarUrl(profile.avatar_url)}
            alt={profile.nickname ?? "User Avatar"}
            width={112}
            height={112}
            className="size-28 shrink-0 rounded-full object-cover ring-4 ring-[var(--mh-ink)]"
          />
        )}

        <div className="min-w-0 flex-1 pb-1">
          <h1 className="font-display text-4xl uppercase leading-none tracking-[0.02em] text-foreground md:text-5xl">
            {profile.nickname}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-[0.12em] text-[var(--mh-text-mono)]">
            <Link
              href={`/profile/${profile.nickname}/followers`}
              className="hover:text-foreground"
            >
              <span className="text-foreground">{followers.length}</span>{" "}
              Followers
            </Link>

            <Link
              href={`/profile/${profile.nickname}/following`}
              className="hover:text-foreground"
            >
              <span className="text-foreground">{following.length}</span>{" "}
              Following
            </Link>

            <span>
              <span className="text-foreground">{songs.length}</span> Tracks
            </span>

            <span>Since {profile.created_at.slice(0, 4)}</span>
          </div>
        </div>
      </header>

      {/* Bio + social */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        {profile.bio ? (
          <ProfileBio bio={profile.bio} />
        ) : (
          <div className="max-w-2xl" />
        )}

        <SocialLinks links={profile.social_links as SocialLinksValue | null} />
      </div>

      <section className="mt-12 min-w-0 border-t border-white/10 pt-8">
        <h2 className="mb-5 font-display text-sm uppercase tracking-[0.18em] text-[var(--mh-text-meta)]">
          Tracks
        </h2>

        <TrackList songs={songs} isOwner={isOwnProfile} />
      </section>
    </div>
  );
}
