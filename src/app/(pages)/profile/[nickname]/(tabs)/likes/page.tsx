import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getLikedSongs } from "@/actions/songs/get-liked-songs";
import { LikedSongList } from "./components/liked-song-list";
import { notFound } from "next/navigation";

type LikesPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function LikesPage({ params }: LikesPageProps) {
  const { nickname } = await params;

  const { data: profile, error: profileError } =
    await getProfileByNickname(nickname);

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
    <div className="py-10">
      <LikedSongList songs={songs} />
    </div>
  );
}
