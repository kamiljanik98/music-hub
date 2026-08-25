"use client";

import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/social/use-follow";

type FollowButtonProps = {
  profileUserId: string;
  isFollowingInitially?: boolean;
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  label?: string;
};

export function FollowButton({
  profileUserId,
  isFollowingInitially = false,
  size = "sm",
  className,
  label,
}: FollowButtonProps) {
  const { isFollowing, isLoading, toggle } = useFollow(
    profileUserId,
    isFollowingInitially,
  );

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size={size}
      className={className}
      disabled={isLoading}
      onClick={toggle}
    >
      {isFollowing ? (label ?? "Following") : "Follow"}
    </Button>
  );
}
