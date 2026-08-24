"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLike } from "@/hooks/social/use-like";
import { Button } from "@/components/ui/button";

type LikeButtonProps = {
  songId: string;
  isLikedInitially?: boolean;
};

export function LikeButton({
  songId,
  isLikedInitially = false,
}: LikeButtonProps) {
  const { isLiked, toggle } = useLike(songId, isLikedInitially);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggle();
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      aria-label={isLiked ? "Unlike" : "Like"}
      className="p-2 hover:bg-muted hover:text-foreground"
    >
      <Heart className={cn("size-4", isLiked && "fill-primary text-primary")} />
    </Button>
  );
}
