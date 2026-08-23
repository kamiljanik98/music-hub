"use client";

import { Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CopyLinkButtonProps = {
  path: string;
};

export function CopyLinkButton({ path }: CopyLinkButtonProps) {
  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      aria-label="Copy link"
      className="p-2 hover:bg-[var(--muted)] hover:text-foreground"
    >
      <Link size={14} />
    </Button>
  );
}
