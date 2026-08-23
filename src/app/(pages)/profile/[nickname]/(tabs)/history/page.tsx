import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getPlayHistory } from "@/actions/songs/get-play-history";
import { createClient } from "@/lib/supabase/server";
import { SongList } from "./components/song-list";
import { notFound } from "next/navigation";

type HistoryPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { nickname } = await params;

  const { data: profile, error: profileError } =
    await getProfileByNickname(nickname);

  if (profileError) {
    return <p className="text-destructive">Failed to load profile</p>;
  }

  if (!profile) {
    return notFound();
  }

  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser?.id !== profile.id) {
    return (
      <p className="text-sm text-muted-foreground">
        Listening history is only visible to its owner.
      </p>
    );
  }

  const { data: songs, error } = await getPlayHistory(profile.id);

  if (error) {
    return <p className="text-destructive">Failed to load listening history</p>;
  }

  return (
    <div className="py-10">
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          COLLECTION / RECENTLY PLAYED
        </p>

        <div className="flex items-baseline justify-end gap-4">
          <h1 className="font-display text-6xl leading-none tracking-tight uppercase text-foreground">
            HISTORY
          </h1>

          <p className="font-mono text-2xl tabular-nums text-muted-foreground">
            [{songs.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      {songs.length ? (
        <SongList songs={songs} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Nothing played yet — press play on a track and it will show up here.
        </p>
      )}
    </div>
  );
}
