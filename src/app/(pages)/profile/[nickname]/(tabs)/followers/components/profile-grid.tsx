import { ProfileCard } from "./profile-card";
import type { ProfileSummary } from "@/types";

type GridProfile = ProfileSummary & {
  followerCount?: number;
  trackCount?: number;
  isFollowing?: boolean;
  isSelf?: boolean;
};

export const ProfileGrid = ({
  title,
  users,
  emptyMessage = "Nobody here yet.",
}: {
  title?: string;
  users: GridProfile[];
  emptyMessage?: string;
}) => {
  if (!users.length && title) return null;

  return (
    <div className="mb-10 flex flex-col gap-3">
      {title && (
        <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
      )}
      {users.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <ProfileCard
              key={user.id}
              user={user}
              followerCount={user.followerCount}
              trackCount={user.trackCount}
              isFollowing={user.isFollowing}
              showFollowButton={!user.isSelf}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
};
