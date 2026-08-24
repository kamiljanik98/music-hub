import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getFollowedUsers } from "@/actions/social/get-followed-users";
import { FollowingCard } from "./components/following-card";
import { notFound } from "next/navigation";

type FollowingPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { nickname } = await params;

  const { data: profile, error: profileError } =
    await getProfileByNickname(nickname);

  if (profileError) {
    return <p className="text-destructive">Failed to load profile</p>;
  }

  if (!profile) {
    return notFound();
  }

  const { data: users, error } = await getFollowedUsers(profile.id);

  if (error) {
    return <p className="text-destructive">Failed to load following artists</p>;
  }

  return (
    <div className="py-10">
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          NETWORK / FOLLOWING
        </p>

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl leading-none tracking-tight uppercase text-foreground md:text-6xl">
            FOLLOWING
          </h1>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{users.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      {users.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {users.map((user) => (
            <FollowingCard
              key={user.id}
              user={user}
              followerCount={user.followerCount}
              trackCount={user.trackCount}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nobody here yet.</p>
      )}
    </div>
  );
}
