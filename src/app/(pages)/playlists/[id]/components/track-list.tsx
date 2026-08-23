"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useOnPlay } from "@/hooks/player/use-on-play";
import { LikedRow } from "@/components/songs/liked-row";
import { removeSongFromPlaylist } from "@/actions/playlists/remove-song-from-playlist";
import type { PlaylistTrack } from "@/actions/playlists/get-playlist-by-id";

type TrackListProps = {
  playlistId: string;
  tracks: PlaylistTrack[];
  isOwner: boolean;
};

export function TrackList({ playlistId, tracks, isOwner }: TrackListProps) {
  const onPlay = useOnPlay(tracks);
  const [isRemoving, startRemove] = useTransition();
  const router = useRouter();

  const remove = (songId: string) => {
    startRemove(async () => {
      const { error } = await removeSongFromPlaylist(playlistId, songId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Removed from playlist");
      router.refresh();
    });
  };

  if (!tracks.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing here yet — add tracks from the feed or a track page.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2.5">
      {tracks.map((track) => (
        <div key={track.id} className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <LikedRow
              song={track}
              onPlay={onPlay}
              likesCount={track.likesCount}
              isLikedInitially={track.isLiked}
            />
          </div>

          {isOwner && (
            <button
              type="button"
              disabled={isRemoving}
              onClick={() => remove(track.id)}
              aria-label={`Remove ${track.title} from playlist`}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
