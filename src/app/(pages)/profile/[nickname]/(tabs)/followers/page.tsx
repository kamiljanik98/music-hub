import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getFollowers } from "@/actions/social/get-followers";
import { ProfileGrid } from "@/components/social/profile-grid";
import { notFound } from "next/navigation";

type FollowersPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { nickname } = await params;
  const { data: profile, error: profileError } =
    await getProfileByNickname(nickname);

  if (profileError) {
    return <p className="text-destructive">Failed to load profile</p>;
  }

  if (!profile) {
    return notFound();
  }

  const { data: users, error } = await getFollowers(profile.id);

  if (error) {
    return <p className="text-destructive">Failed to load followers</p>;
  }

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-lg font-semibold text-neutral-100">
        {profile.nickname}&apos;s followers
      </h1>
      <ProfileGrid users={users} />
    </div>
  );
}
