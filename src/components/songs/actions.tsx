"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LikeButton } from "@/components/social/like-button";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditSongDialog } from "./edit-song-dialog";
import { deleteSong } from "@/actions/songs/delete-song";
import type { Song } from "@/types";

type ActionsProps = {
  songId: string;
  isLikedInitially?: boolean;
  isOwner?: boolean;
  song?: Song;
};

export function Actions({
  songId,
  isLikedInitially = false,
  isOwner = false,
  song,
}: ActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const confirmDelete = () => {
    startDelete(async () => {
      const { error } = await deleteSong(songId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Track deleted");
      setIsDeleteOpen(false);
    });
  };

  return (
    <div className="flex items-center gap-1">
      <LikeButton songId={songId} isLikedInitially={isLikedInitially} />
      <CopyLinkButton path={`/songs/${songId}`} />

      {isOwner && song && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Track options"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                <Pencil className="size-4" />
                Edit track
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete track
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditSongDialog
            song={song}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />

          <AlertDialog
            open={isDeleteOpen}
            onOpenChange={(next) => {
              if (isDeleting) return;
              setIsDeleteOpen(next);
            }}
          >
            <AlertDialogContent className="max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this track?</AlertDialogTitle>
                <AlertDialogDescription>
                  {song.title} and its audio, cover and stems are removed
                  permanently. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.preventDefault();
                    confirmDelete();
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete track"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
