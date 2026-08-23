import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import { getAvatarUrl } from "@/lib/r2/public";
import { ProfileSummary } from "@/types";

type FollowingCardProps = {
  user: ProfileSummary;
  followerCount?: number;
  trackCount?: number;
};

export const FollowingCard = ({
  user,
  followerCount,
  trackCount,
}: FollowingCardProps) => {
  const hasCounts = followerCount !== undefined || trackCount !== undefined;

  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-white/8 bg-[var(--mh-solid)] p-4">
      <Link href={`/profile/${user.nickname}`} className="shrink-0">
        <Image
          src={getAvatarUrl(user.avatar_url)}
          alt={user.nickname ?? "User"}
          width={96}
          height={96}
          className="size-16 rounded-full object-cover ring-1 ring-white/10 sm:size-24"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/profile/${user.nickname}`}
          className="truncate text-lg font-semibold text-foreground transition-colors hover:text-primary hover:underline"
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
        isFollowingInitially
        label="Unfollow"
        size="sm"
      />
    </div>
  );
};
