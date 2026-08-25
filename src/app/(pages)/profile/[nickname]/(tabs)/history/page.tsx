import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getPlayHistory } from "@/actions/songs/get-play-history";
import { createClient } from "@/lib/supabase/server";
import { SongRowList } from "@/components/songs/song-row-list";
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

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl leading-none tracking-tight uppercase text-foreground md:text-6xl">
            HISTORY
          </h1>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{songs.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      {songs.length ? (
        <SongRowList songs={songs} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Nothing played yet — press play on a track and it will show up here.
        </p>
      )}
    </div>
  );
}
