import Image from "next/image";
import Link from "next/link";
import type { Song } from "@/types";
import { getCoverUrl } from "@/lib/r2/public";

import { TitleLink } from "@/components/songs/title-link";

interface TrackInfoProps {
  song: Song;
}

export function TrackInfo({ song }: TrackInfoProps) {
  const nickname = song.profiles?.nickname;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src={getCoverUrl(song.image_path)}
        alt={song.title}
        width={56}
        height={56}
        className="size-14 shrink-0 rounded-sm object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <TitleLink
          songId={song.id}
          title={song.title}
          className="text-sm font-medium"
        />
        {nickname ? (
          <Link
            href={`/profile/${nickname}`}
            className="truncate text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            {nickname}
          </Link>
        ) : (
          <span className="truncate text-xs text-muted-foreground">Unknown</span>
        )}
      </div>
    </div>
  );
}
