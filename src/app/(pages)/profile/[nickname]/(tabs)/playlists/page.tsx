import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { getUserPlaylists } from "@/actions/playlists/get-user-playlists";
import { createClient } from "@/lib/supabase/server";
import { PlaylistGrid } from "./components/playlist-grid";
import { notFound } from "next/navigation";

type PlaylistsPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function PlaylistsPage({ params }: PlaylistsPageProps) {
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

  const { data: playlists, error } = await getUserPlaylists(profile.id);

  if (error) {
    return <p className="text-destructive">Failed to load playlists</p>;
  }

  return (
    <div className="py-10">
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          COLLECTION / PLAYLISTS
        </p>

        <div className="flex items-baseline justify-end gap-4">
          <h1 className="font-display text-6xl leading-none tracking-tight uppercase text-foreground">
            PLAYLISTS
          </h1>

          <p className="font-mono text-2xl tabular-nums text-muted-foreground">
            [{playlists.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      <PlaylistGrid
        playlists={playlists}
        canCreate={currentUser?.id === profile.id}
      />
    </div>
  );
}
