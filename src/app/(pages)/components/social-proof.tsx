import Image from "next/image";
import { getAvatarUrl } from "@/lib/r2/public";
import type { ProfileSummary } from "@/types";

type SocialProofProps = {
  artists: ProfileSummary[];
  label: string;
};

export const SocialProof = ({ artists, label }: SocialProofProps) => {
  if (!artists.length) return null;

  return (
    <div className="mt-2 flex items-center gap-3.5">
      <div className="flex -space-x-3">
        {artists.map((artist) => (
          <Image
            key={artist.id}
            src={getAvatarUrl(artist.avatar_url)}
            alt={artist.nickname ?? "Artist"}
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-2 ring-[var(--mh-ink)]"
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
