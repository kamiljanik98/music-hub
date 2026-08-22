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
    <div className="px-6 py-10">
      <h1 className="mb-6 text-lg font-semibold text-neutral-100">
        {profile.nickname} is following
      </h1>
      <ProfileGrid users={users} />
    </div>
  );
}
