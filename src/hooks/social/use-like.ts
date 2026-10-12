"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { toast } from "sonner";

import { likeSong } from "@/actions/social/like-song";
import { unlikeSong } from "@/actions/social/unlike-song";
import { useRequireAuth } from "@/hooks/auth/use-require-auth";

type LikeStore = {
  likes: Record<string, boolean>;
  pending: Record<string, boolean>;
  initialize: (songId: string, isLiked: boolean) => void;
  setLiked: (songId: string, isLiked: boolean) => void;
  setPending: (songId: string, pending: boolean) => void;
};

const useLikeStore = create<LikeStore>((set) => ({
  likes: {},
  pending: {},

  initialize: (songId, isLiked) =>
    set((state) => {
      if (songId in state.likes) return state;

      return {
        likes: { ...state.likes, [songId]: isLiked },
      };
    }),

  setLiked: (songId, isLiked) =>
    set((state) => ({
      likes: { ...state.likes, [songId]: isLiked },
    })),

  setPending: (songId, pending) =>
    set((state) => ({
      pending: { ...state.pending, [songId]: pending },
    })),
}));

export function useLike(songId: string, isLikedInitially: boolean) {
  const isLiked = useLikeStore(
    (state) => state.likes[songId] ?? isLikedInitially,
  );
  const pending = useLikeStore((state) => state.pending[songId] ?? false);
  const initialize = useLikeStore((state) => state.initialize);
  const setLiked = useLikeStore((state) => state.setLiked);
  const setPending = useLikeStore((state) => state.setPending);

  const requireAuth = useRequireAuth();

  useEffect(() => {
    initialize(songId, isLikedInitially);
  }, [songId, isLikedInitially, initialize]);

  async function toggle() {
    if (pending || !requireAuth()) return;

    const current = useLikeStore.getState().likes[songId] ?? isLikedInitially;
    const next = !current;

    setPending(songId, true);
    setLiked(songId, next);

    try {
      const { error } = next
        ? await likeSong(songId)
        : await unlikeSong(songId);

      if (error) {
        setLiked(songId, current);
        toast.error(error.message);
        return;
      }

      toast.success(next ? "Added to your library" : "Removed from library");
    } finally {
      setPending(songId, false);
    }
  }

  return { isLiked, toggle };
}
