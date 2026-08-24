import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import { getAvatarUrl } from "@/lib/r2/public";
import { ProfileSummary } from "@/types";

type ProfileCardProps = {
  user: ProfileSummary;
  isFollowing?: boolean;
  followerCount?: number;
  trackCount?: number;
};

export const ProfileCard = ({
  user,
  isFollowing = false,
  followerCount,
  trackCount,
}: ProfileCardProps) => {
  const hasCounts = followerCount !== undefined || trackCount !== undefined;

  return (
    <div className="flex flex-col items-center gap-4 rounded-[24px] border border-white/8 bg-[var(--mh-solid)] p-6">
      <Link href={`/profile/${user.nickname}`} className="shrink-0">
        <Image
          src={getAvatarUrl(user.avatar_url)}
          alt={user.nickname ?? "User"}
          width={72}
          height={72}
          className="size-[72px] rounded-full object-cover ring-1 ring-white/10"
        />
      </Link>

      <Link
        href={`/profile/${user.nickname}`}
        className="max-w-full truncate text-lg font-semibold text-foreground transition-colors hover:text-primary"
      >
        {user.nickname}
      </Link>

      {hasCounts && (
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="flex flex-col items-center rounded-[16px] bg-white/5 px-3 py-2.5">
            <span className="font-display text-xl leading-none text-foreground">
              {followerCount ?? 0}
            </span>
            <span className="mt-1 text-xs text-[var(--mh-text-meta)]">
              followers
            </span>
          </div>

          <div className="flex flex-col items-center rounded-[16px] bg-white/5 px-3 py-2.5">
            <span className="font-display text-xl leading-none text-foreground">
              {trackCount ?? 0}
            </span>
            <span className="mt-1 text-xs text-[var(--mh-text-meta)]">
              tracks
            </span>
          </div>
        </div>
      )}

      <FollowButton
        profileUserId={user.id}
        isFollowingInitially={isFollowing}
        className="w-full"
      />
    </div>
  );
};
