import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import { getAvatarUrl } from "@/lib/r2/public";
import { ProfileSummary } from "@/types";

type ProfileRowProps = {
  user: ProfileSummary;
  isFollowing?: boolean;
  followerCount?: number;
  trackCount?: number;
};

export const ProfileRow = ({
  user,
  isFollowing = false,
  followerCount,
  trackCount,
}: ProfileRowProps) => {
  const hasCounts = followerCount !== undefined || trackCount !== undefined;

  return (
    <div className="flex items-center gap-3 rounded-md p-2">
      <Link href={`/profile/${user.nickname}`} className="shrink-0">
        <Image
          src={getAvatarUrl(user.avatar_url)}
          alt={user.nickname ?? "User"}
          width={56}
          height={56}
          className="size-14 rounded-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/profile/${user.nickname}`}
          className="truncate text-base font-medium text-foreground transition-colors hover:text-primary hover:underline"
        >
          {user.nickname}
        </Link>

        {hasCounts && (
          <p className="truncate text-sm text-[var(--mh-text-meta)]">
            {followerCount ?? 0}{" "}
            {followerCount === 1 ? "follower" : "followers"}
            {" · "}
            {trackCount ?? 0} {trackCount === 1 ? "track" : "tracks"}
          </p>
        )}
      </div>

      <FollowButton
        profileUserId={user.id}
        isFollowingInitially={isFollowing}
        size="xs"
      />
    </div>
  );
};
