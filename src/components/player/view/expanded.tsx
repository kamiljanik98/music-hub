"use client";

import Link from "next/link";
import { ChevronDown, Info } from "lucide-react";
import Image from "next/image";
import { LikeButton } from "@/components/social/like-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSongMeta } from "@/lib/format/song-meta";
import { getAvatarUrl, getCoverUrl } from "@/lib/r2/public";
import { Song } from "@/types";

import { Controls } from "../controls";
import { RepeatButton } from "../repeat-button";
import { Seekbar } from "../seekbar";
import { AddToPlaylistMenu } from "@/components/playlists/add-to-playlist-menu";
import { useRouter } from "next/navigation";

type ExpandedViewProps = {
  song: Song;
  onClose: () => void;
};

export const ExpandedView = ({ song, onClose }: ExpandedViewProps) => {
  const router = useRouter();
  const meta = getSongMeta(song);

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  const hasMeta =
    meta.description ||
    meta.bpm != null ||
    meta.scale ||
    meta.genre ||
    meta.tags?.length ||
    meta.createdAt ||
    meta.plays != null;

  return (
    <section
      aria-label="Full player"
      className="fixed inset-0 z-50 flex h-dvh min-w-0 flex-col overflow-y-auto overscroll-none bg-background px-8 pb-6 pt-4 md:hidden"
    >
      <header className="-mx-4 flex w-[calc(100%+2rem)] shrink-0 items-center justify-between gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Close full player"
        >
          <ChevronDown className="size-6" />
        </button>

        <div className="min-w-0 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Now playing
          </p>
          <p className="mt-0.5 text-xs text-foreground/80">Music Hub</p>
        </div>

        <div className="size-11 shrink-0" />
      </header>

      <div className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col justify-center gap-6 py-6">
        <div className="w-full">
          <div className="mb-4 flex justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Song information"
                  className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Info className="size-7" />
                  <span className="text-sm">Details</span>
                </button>
              </PopoverTrigger>

              <PopoverContent side="bottom" align="start" className="ml-3 w-64">
                {hasMeta ? (
                  <div className="flex flex-col gap-0.5 text-xs">
                    {meta.description && <p>{meta.description}</p>}
                    {meta.bpm != null && <p>BPM: {meta.bpm}</p>}
                    {meta.scale && <p>Scale: {meta.scale}</p>}
                    {meta.genre && <p>Genre: {meta.genre}</p>}
                    {meta.tags?.length ? (
                      <p>Tags: {meta.tags.join(", ")}</p>
                    ) : null}
                    {meta.createdAt && (
                      <p>
                        Uploaded:{" "}
                        {new Date(meta.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {meta.plays != null && <p>Plays: {meta.plays}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No track details yet
                  </p>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative mb-6 aspect-square w-full">
            <div className="absolute inset-4 rounded-2xl bg-primary/10 blur-2xl" />

            <div className="relative size-full overflow-hidden rounded-2xl bg-muted shadow-2xl">
              {song.image_path ? (
                <img
                  src={getCoverUrl(song.image_path)}
                  alt={`Cover of ${song.title}`}
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src="/placeholders/cover-placeholder.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => navigateTo(`/songs/${song.id}`)}
              className="truncate text-xl font-semibold text-foreground transition-colors hover:text-primary"
            >
              {song.title}
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <img
                src={getAvatarUrl(song.profiles?.avatar_url ?? null)}
                alt=""
                className="size-6 shrink-0 rounded-full object-cover"
              />
              {song.profiles?.nickname ? (
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(`/profile/${song.profiles!.nickname}`)
                  }
                  className="truncate text-left transition-colors hover:text-foreground"
                >
                  {song.profiles.nickname}
                </button>
              ) : (
                <span className="truncate">Unknown</span>
              )}
            </div>
          </div>

          <div className="mr-[-14px] shrink-0 [&_button]:size-12 [&_button_svg]:size-6">
            <LikeButton songId={song.id} isLikedInitially={song.isLiked} />
          </div>
        </div>

        <div className="mb-6 min-w-0 py-2 [&_[role=slider]]:size-5">
          <Seekbar />
        </div>

        <div className="flex w-full items-center justify-center gap-6">
          <RepeatButton className="size-12 [&_svg]:size-8" />
          <Controls />
          <AddToPlaylistMenu
            songId={song.id}
            className="size-12 [&_svg]:size-8"
          />
        </div>
      </div>
    </section>
  );
};
