import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getLikedSongs } from "@/actions/songs/get-liked-songs";
import { SongList } from "./components/song-list";
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
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          COLLECTION / LIKED TRACKS
        </p>

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl leading-none tracking-tight uppercase text-foreground md:text-6xl">
            LIKES
          </h1>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{songs.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      <SongList songs={songs} />
    </div>
  );
}
