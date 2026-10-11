import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";

import { getSongById } from "@/actions/songs/get-song-by-id";
import { AddToPlaylistMenu } from "@/components/playlists/add-to-playlist-menu";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import { LikeButton } from "@/components/social/like-button";
import { SongOwnerMenu } from "@/components/songs/song-owner-menu";
import { Waveform } from "@/components/songs/waveform";
import { formatSongMeta, getSongMeta } from "@/lib/format/song-meta";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { createClient } from "@/lib/supabase/server";

import { StemList } from "./components/stem-list";

type SongPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SongPage({ params }: SongPageProps) {
  const { id } = await params;
  const { data: song, error } = await getSongById(id);

  if (error) {
    return <p className="text-destructive">Failed to load song</p>;
  }

  if (!song) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === song.uploaded_by;
  const meta = formatSongMeta(song);
  const songMeta = getSongMeta(song);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Uploaded by</span>

          <Link
            href={`/profile/${song.profiles?.nickname ?? ""}`}
            className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Image
              src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
              alt={song.profiles?.nickname ?? "Artist avatar"}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover"
            />
            <span className="max-w-32 truncate">
              {song.profiles?.nickname ?? "Unknown"}
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Image
            src={getCoverUrl(song.image_path)}
            alt={song.title}
            width={360}
            height={360}
            className="aspect-square w-full rounded-md object-cover sm:size-90"
          />

          <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-3">
              <h1 className="break-words text-2xl font-semibold text-foreground">
                {song.title}
              </h1>

              <p className="text-sm text-muted-foreground">
                {meta || "No track details yet"}
              </p>

              <div className="hidden flex-col gap-1 text-sm text-muted-foreground sm:flex">
                {songMeta.genre && (
                  <p>
                    <span className="text-foreground">Genre:</span>{" "}
                    {songMeta.genre}
                  </p>
                )}

                {songMeta.scale && (
                  <p>
                    <span className="text-foreground">Scale:</span>{" "}
                    {songMeta.scale}
                  </p>
                )}

                {songMeta.bpm != null && (
                  <p>
                    <span className="text-foreground">BPM:</span> {songMeta.bpm}
                  </p>
                )}

                {songMeta.tags?.length ? (
                  <p>
                    <span className="text-foreground">Tags:</span>{" "}
                    {songMeta.tags.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <CopyLinkButton path={`/songs/${song.id}`} />
              {isOwner && <SongOwnerMenu song={song} />}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Waveform songId={song.id} path={song.path} />

        <div className="flex justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base">
            <div className="flex items-center gap-2">
              <div className="-ml-2">
                <LikeButton songId={song.id} isLikedInitially={song.isLiked} />
              </div>
              <span className="text-muted-foreground">
                {song.likesCount} {song.likesCount === 1 ? "like" : "likes"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Play className="size-5 shrink-0" aria-hidden="true" />
              {song.play_count} {song.play_count === 1 ? "play" : "plays"}
            </div>
          </div>

          <div className="-mr-2 shrink-0 [&_button]:size-11 [&_button_svg]:size-5">
            <AddToPlaylistMenu songId={song.id} />
          </div>
        </div>

        <StemList stems={song.stems ?? []} />
      </div>
    </div>
  );
}
