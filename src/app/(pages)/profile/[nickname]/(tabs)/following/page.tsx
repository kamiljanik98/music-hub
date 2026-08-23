import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getFollowedUsers } from "@/actions/social/get-followed-users";
import { ProfileGrid } from "@/components/social/profile-grid";
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

        <div className="flex items-baseline justify-end gap-4">
          <h1 className="font-display text-6xl leading-none tracking-tight uppercase text-foreground">
            FOLLOWING
          </h1>

          <p className="font-mono text-2xl tabular-nums text-muted-foreground">
            [{users.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      <ProfileGrid users={users} />
    </div>
  );
}
