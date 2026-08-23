import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { getCoverUrl, getAvatarUrl } from "@/lib/r2/public";
import { formatSongMeta } from "@/lib/format/song-meta";
import { LikeButton } from "@/components/social/like-button";
import { getSongById } from "@/actions/songs/get-song-by-id";
import { createClient } from "@/lib/supabase/server";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import { AddToPlaylistMenu } from "@/components/playlists/add-to-playlist-menu";
import { Waveform } from "@/components/songs/waveform";
import { SongOwnerMenu } from "@/components/songs/song-owner-menu";
import { List } from "@/components/stems/list";

type SongPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SongPage({ params }: SongPageProps) {
  const { id } = await params;
  const { data: song, error: songError } = await getSongById(id);

  if (songError) {
    return <p className="text-destructive">Failed to load song</p>;
  }

  if (!song) notFound();

  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwner = currentUser?.id === song.uploaded_by;

  const meta = formatSongMeta(song);

  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="flex gap-6">
        <Image
          src={getCoverUrl(song.image_path)}
          alt={song.title}
          width={200}
          height={200}
          className="size-48 shrink-0 rounded-md object-cover"
        />
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {song.title}
            </h1>
            <Link
              href={`/profile/${song.profiles?.nickname ?? ""}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Image
                src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
                alt={song.profiles?.nickname ?? "Artist avatar"}
                width={20}
                height={20}
                className="size-5 rounded-full object-cover"
              />
              {song.profiles?.nickname ?? "Unknown"}
            </Link>
            <p className="text-xs text-muted-foreground">
              {meta || "No track details yet"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <LikeButton songId={song.id} isLikedInitially={song.isLiked} />
              <span className="text-sm text-muted-foreground">
                {song.likesCount} {song.likesCount === 1 ? "like" : "likes"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Play className="size-4" aria-hidden="true" />
              {song.play_count} {song.play_count === 1 ? "play" : "plays"}
            </div>
            <AddToPlaylistMenu songId={song.id} />
            <CopyLinkButton path={`/songs/${song.id}`} />
          </div>
        </div>

        {isOwner && (
          <div className="self-start">
            <SongOwnerMenu song={song} />
          </div>
        )}
      </div>

      <Waveform songId={song.id} path={song.path} />

      <List stems={song.stems ?? []} />
    </div>
  );
}
