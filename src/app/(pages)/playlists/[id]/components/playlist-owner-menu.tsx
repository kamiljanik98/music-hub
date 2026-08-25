"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { deletePlaylist } from "@/actions/playlists/delete-playlist";
import useUser from "@/hooks/profile/use-user";

type PlaylistOwnerMenuProps = {
  playlistId: string;
};

export function PlaylistOwnerMenu({ playlistId }: PlaylistOwnerMenuProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const user = useUser((state) => state.user);
  const router = useRouter();

  const confirmDelete = () => {
    startDelete(async () => {
      const { error } = await deletePlaylist(playlistId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Playlist deleted");
      setIsDeleteOpen(false);
      router.push(user?.nickname ? `/profile/${user.nickname}/playlists` : "/");
    });
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label="Playlist options"
          className="flex cursor-pointer items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-auto min-w-44">
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(next) => {
          if (isDeleting) return;
          setIsDeleteOpen(next);
        }}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              The playlist and its track order are removed permanently. The
              tracks themselves are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
            >
              {isDeleting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                "Delete playlist"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
