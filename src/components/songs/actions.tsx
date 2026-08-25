"use client";

import { LikeButton } from "@/components/social/like-button";
import { CopyLinkButton } from "@/components/social/copy-link-button";
import { AddToPlaylistMenu } from "@/components/playlists/add-to-playlist-menu";
import { SongOwnerMenu } from "./song-owner-menu";
import type { Song } from "@/types";

type ActionsProps = {
  songId: string;
  isLikedInitially?: boolean;
  isOwner?: boolean;
  showCopyLink?: boolean;
  song?: Song;
};

export function Actions({
  songId,
  isLikedInitially = false,
  isOwner = false,
  showCopyLink = true,
  song,
}: ActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <LikeButton songId={songId} isLikedInitially={isLikedInitially} />
      <AddToPlaylistMenu songId={songId} />
      {showCopyLink && <CopyLinkButton path={`/songs/${songId}`} />}

      {isOwner && song && <SongOwnerMenu song={song} />}
    </div>
  );
}
