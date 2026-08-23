import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPlaylistById } from "@/actions/playlists/get-playlist-by-id";
import { createClient } from "@/lib/supabase/server";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import { TrackList } from "./components/track-list";
import { PlaylistOwnerMenu } from "@/components/playlists/playlist-owner-menu";

type PlaylistPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;

  const { data, error } = await getPlaylistById(id);

  if (error) {
    return <p className="text-destructive">Failed to load playlist</p>;
  }

  if (!data) {
    return notFound();
  }

  const { playlist, tracks } = data;

  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwner = currentUser?.id === playlist.owner_id;

  return (
    <div className="py-10">
      <Link
        href={`/profile/${playlist.profiles?.nickname ?? ""}/playlists`}
        className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All playlists
      </Link>

      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          PLAYLIST / {playlist.is_public ? "PUBLIC" : "PRIVATE"}
        </p>

        <div className="flex items-baseline justify-end gap-4">
          <div className="mr-auto flex shrink-0 items-center gap-1 self-center">
            <CopyLinkButton path={`/playlists/${playlist.id}`} />

            {isOwner && <PlaylistOwnerMenu playlistId={playlist.id} />}
          </div>

          <h1 className="font-display text-6xl leading-none tracking-tight uppercase text-foreground">
            {playlist.title}
          </h1>

          <p className="font-mono text-2xl tabular-nums text-muted-foreground">
            [{tracks.length.toString().padStart(3, "0")}]
          </p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {playlist.description || "No description"}
        </p>

        <Link
          href={`/profile/${playlist.profiles?.nickname ?? ""}`}
          className="mt-1 inline-block text-sm text-[var(--mh-text-meta)] transition-colors hover:text-primary hover:underline"
        >
          by {playlist.profiles?.nickname ?? "Unknown"}
        </Link>
      </div>

      <TrackList playlistId={playlist.id} tracks={tracks} isOwner={isOwner} />
    </div>
  );
}
