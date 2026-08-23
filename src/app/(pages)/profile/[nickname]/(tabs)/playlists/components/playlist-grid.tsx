"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlaylistCard } from "@/components/playlists/playlist-card";
import { CreatePlaylistDialog } from "@/components/playlists/create-playlist-dialog";
import type { PlaylistSummary } from "@/types";

type PlaylistGridProps = {
  playlists: PlaylistSummary[];
  canCreate: boolean;
};

export function PlaylistGrid({ playlists, canCreate }: PlaylistGridProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {canCreate && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            New playlist
          </Button>
        </div>
      )}

      {playlists.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No playlists yet.</p>
      )}

      <CreatePlaylistDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={(playlistId) => router.push(`/playlists/${playlistId}`)}
      />
    </div>
  );
}
