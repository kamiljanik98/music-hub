"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/types/database.types";
import { resolveStemUrl } from "@/actions/stems/resolve-stem-url";

type Stem = Pick<
  Database["public"]["Tables"]["stems"]["Row"],
  "id" | "category" | "path"
>;

export function StemList({ stems }: { stems: Stem[] }) {
  if (!stems.length) return null;

  async function handleDownload(path: string) {
    const { url, error } = await resolveStemUrl(path);
    if (error || !url) {
      toast.error("Failed to load stem");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-neutral-100">Stems</h2>
      <div className="flex flex-col divide-y divide-border rounded-md border border-border">
        {stems.map((stem) => (
          <div
            key={stem.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm capitalize text-foreground">
              {stem.category}
            </span>
            <button
              onClick={() => handleDownload(stem.path)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
