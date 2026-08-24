"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Pause } from "lucide-react";
import { getAvatarUrl } from "@/lib/r2/public";
import { useOnPlay } from "@/hooks/player/use-on-play";
import usePlayer from "@/hooks/player/use-player";
import { Button } from "@/components/ui/button";
import type { PlaylistTrack } from "@/actions/playlists/get-playlist-by-id";
import type { Playlist } from "@/types";

const formatCreated = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type PromoBannerProps = {
  playlist: Playlist;
  tracks: PlaylistTrack[];
};

export const PromoBanner = ({ playlist, tracks }: PromoBannerProps) => {
  const onPlay = useOnPlay(tracks);
  const activeId = usePlayer((state) => state.activeId);
  const isPlaying = usePlayer((state) => state.isPlaying);

  const firstTrack = tracks[0];
  const isActive = tracks.some((track) => track.id === activeId);

  const href = `/playlists/${playlist.id}`;

  return (
    <section className="relative isolate flex min-h-[320px] items-center overflow-hidden rounded-[var(--mh-radius-card)] bg-[var(--mh-solid)] sm:min-h-[400px] md:min-h-[460px]">
      <div className="absolute inset-0 overflow-hidden rounded-[inherit] [transform:translateZ(0)]">
        <Image
          src="/media/banner.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="rounded-[inherit] object-cover"
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/media/banner.jpg"
          aria-hidden="true"
          className="absolute inset-0 size-full rounded-[inherit] object-cover motion-reduce:hidden"
        >
          <source src="/media/banner.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.96)_0%,rgba(10,10,10,0.88)_32%,rgba(10,10,10,0.45)_62%,rgba(10,10,10,0.05)_100%)]" />
      </div>

      <div className="relative flex max-w-[620px] flex-col gap-3.5 px-5 py-8 sm:px-8 sm:py-9 md:px-12 md:py-11">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Playlist
        </p>

        <Link href={href} className="w-fit">
          <h2 className="font-display text-3xl leading-[0.95] text-foreground sm:text-4xl md:text-5xl">
            {playlist.title}
          </h2>
        </Link>

        <p className="max-w-[480px] text-sm text-[var(--mh-text-lead)] md:text-base">
          {playlist.description || "A hand-picked set from the MusicHub crew."}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--mh-text-meta)]">
          <Link
            href={`/profile/${playlist.profiles?.nickname ?? ""}`}
            className="flex items-center gap-2 transition-colors hover:text-primary hover:underline"
          >
            <Image
              src={getAvatarUrl(playlist.profiles?.avatar_url ?? null)}
              alt={playlist.profiles?.nickname ?? "Unknown"}
              width={24}
              height={24}
              className="size-6 rounded-full object-cover"
            />

            <span className="font-medium text-foreground">
              {playlist.profiles?.nickname ?? "Unknown"}
            </span>
          </Link>

          <span aria-hidden="true">·</span>

          <span>
            {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
          </span>

          <span aria-hidden="true">·</span>

          <span>Created {formatCreated(playlist.created_at)}</span>
        </div>

        <div className="mt-1 flex items-center gap-4">
          <button
            type="button"
            disabled={!firstTrack}
            onClick={() => firstTrack && onPlay(firstTrack.id)}
            aria-label={
              isActive && isPlaying ? "Pause playlist" : "Play playlist"
            }
            className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isActive && isPlaying ? (
              <Pause className="size-5" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 size-5" fill="currentColor" />
            )}
          </button>

          <Button asChild size="lg" variant="outline">
            <Link href={href}>
              Listen now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
