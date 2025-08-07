"use client";

import MediaItem from "@/components/MediaItem";
import { Song } from "@/types";
import { FC } from "react";
import useOnPlay from "@/hooks/useOnPlay";

interface SearchContentProps {
  songs: Song[];
  query: boolean;
}

const SearchContent: FC<SearchContentProps> = ({ songs, query }) => {
  const onPlay = useOnPlay(songs);

  if (query && songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No songs found.</div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full overflow-auto">
      {songs.map((song) => (
        <div className="flex items-center gap-x-4 w-full" key={song.id}>
          <div className="flex-1">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
