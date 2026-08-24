"use client";

import { useState, useTransition } from "react";
import { ListPlus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addSongToPlaylist } from "@/actions/playlists/add-song-to-playlist";
import { useMyPlaylists } from "@/hooks/playlists/use-my-playlists";
import { useRequireAuth } from "@/hooks/auth/use-require-auth";
import { CreatePlaylistDialog } from "./create-playlist-dialog";

type AddToPlaylistMenuProps = {
  songId: string;
};

export function AddToPlaylistMenu({ songId }: AddToPlaylistMenuProps) {
  const { playlists, isLoading, load } = useMyPlaylists();
  const requireAuth = useRequireAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAdding, startAdd] = useTransition();

  const add = (playlistId: string) => {
    startAdd(async () => {
      const { error } = await addSongToPlaylist(playlistId, songId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Added to playlist");
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (next && !requireAuth()) return;

    setIsOpen(next);
    if (next) load();
  };

  return (
    <>
      <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger
          aria-label="Add to playlist"
          className="flex cursor-pointer items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ListPlus className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto min-w-52">
          {isLoading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : playlists.length ? (
            playlists.map((playlist) => (
              <DropdownMenuItem
                key={playlist.id}
                disabled={isAdding}
                onSelect={() => add(playlist.id)}
              >
                {playlist.title}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            New playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreatePlaylistDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={(playlistId) => {
          add(playlistId);
        }}
      />
    </>
  );
}
