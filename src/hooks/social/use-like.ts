"use client";

import { useState } from "react";
import { toast } from "sonner";
import { likeSong } from "@/actions/social/like-song";
import { unlikeSong } from "@/actions/social/unlike-song";
import { useRequireAuth } from "@/hooks/auth/use-require-auth";

export function useLike(songId: string, isLikedInitially: boolean) {
  const [isLiked, setIsLiked] = useState(isLikedInitially);
  const requireAuth = useRequireAuth();

  async function toggle() {
    if (!requireAuth()) return;

    const next = !isLiked;
    setIsLiked(next);

    const { error } = next ? await likeSong(songId) : await unlikeSong(songId);

    if (error) {
      setIsLiked(!next);
      toast.error(error.message);
      return;
    }

    toast.success(next ? "Added to your library" : "Removed from library");
  }

  return { isLiked, toggle };
}
