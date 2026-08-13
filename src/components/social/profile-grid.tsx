import { ProfileCard } from "./profile-card";
import { ProfileSummary } from "@/types";

export const ProfileGrid = ({
  title,
  users,
  emptyMessage = "Nobody here yet.",
}: {
  title?: string;
  users: ProfileSummary[];
  emptyMessage?: string;
}) => {
  if (!users.length && title) return null;

  return (
    <div className="mb-10 flex flex-col gap-3">
      {title && (
        <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
      )}
      {users.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {users.map((user) => (
            <ProfileCard variant="grid" key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
};
