import { followUser } from "@/actions/social/follow-user";
import { unfollowUser } from "@/actions/social/unfollow-user";
import { useState } from "react";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/auth/use-require-auth";

export function useFollow(targetUserId: string, isFollowingInitially: boolean) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitially);
  const [isLoading, setIsLoading] = useState(false);
  const requireAuth = useRequireAuth();

  async function toggle() {
    if (!requireAuth()) return;

    const next = !isFollowing;
    setIsFollowing(next);
    setIsLoading(true);

    const { error } = next
      ? await followUser(targetUserId)
      : await unfollowUser(targetUserId);

    setIsLoading(false);

    if (error) {
      setIsFollowing(!next);
      toast.error(error.message);
      return;
    }

    toast.success(next ? "Following" : "Unfollowed");
  }

  return { isFollowing, isLoading, toggle };
}
