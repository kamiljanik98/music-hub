"use client";

import MediaItem from "@/components/common/MediaItem";
import { Song } from "@/types";
import { FC } from "react";
import useOnPlay from "@/hooks/useOnPlay";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No songs found.</div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 px-4 pt-3 w-full ">
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
