import { ProfileRow } from "./profile-row";
import type { SuggestedProfile } from "@/actions/social/get-suggested-users";

type ProfileListProps = {
  users: SuggestedProfile[];
  title: string;
};

export const ProfileList = ({ users, title }: ProfileListProps) => {
  if (!users.length) return null;

  return (
    <div className="mb-10 flex flex-col gap-3">
      <h2 className="font-display text-sm uppercase tracking-[0.18em] text-[var(--mh-text-meta)]">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <ProfileRow
            key={user.id}
            user={user}
            followerCount={user.followerCount}
            trackCount={user.trackCount}
          />
        ))}
      </div>
    </div>
  );
};
