import Link from "next/link";
import { ListMusic } from "lucide-react";
import type { PlaylistSummary } from "@/types";

type PlaylistCardProps = {
  playlist: PlaylistSummary;
};

export const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-white/8 bg-[var(--mh-solid)] p-4">
      <Link href={`/playlists/${playlist.id}`} className="shrink-0">
        <span className="flex size-16 items-center justify-center rounded-md bg-muted text-[var(--mh-text-meta)] ring-1 ring-white/10 sm:size-24">
          <ListMusic className="size-8" />
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/playlists/${playlist.id}`}
          className="truncate text-lg font-semibold text-foreground transition-colors hover:text-primary hover:underline"
        >
          {playlist.title}
        </Link>

        <p className="truncate text-sm text-[var(--mh-text-meta)]">
          {playlist.trackCount} {playlist.trackCount === 1 ? "track" : "tracks"}
          {" · "}
          {playlist.is_public ? "Public" : "Private"}
        </p>

        <p className="truncate text-sm text-[var(--mh-text-mono)]">
          {playlist.description || "No description"}
        </p>
      </div>
    </div>
  );
};
