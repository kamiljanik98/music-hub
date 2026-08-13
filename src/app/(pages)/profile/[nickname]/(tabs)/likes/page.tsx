import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getLikedSongs } from "@/actions/songs/get-liked-songs";
import { SongList } from "@/components/songs/song-list";
import { notFound } from "next/navigation";

type LikesPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function LikesPage({ params }: LikesPageProps) {
  const { nickname } = await params;
  const { profile, error: profileError } = await getProfileByNickname(nickname);

  if (profileError) {
    return <p className="text-destructive">Failed to load profile</p>;
  }

  if (!profile) {
    return notFound();
  }

  const { data: songs, error } = await getLikedSongs(profile.id);

  if (error) {
    return <p className="text-destructive">Failed to load liked songs</p>;
  }

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-lg font-semibold text-neutral-100">
        {profile.nickname}&apos;s likes
      </h1>
      <SongList songs={songs} />
    </div>
  );
}
