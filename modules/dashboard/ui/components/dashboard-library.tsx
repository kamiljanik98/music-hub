"use client";
import { Song } from "@/types";
import { FC } from "react";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { RiPlayListFill } from "react-icons/ri";

interface Props {
  songs: Song[];
}

const DashboardLibrary: FC<Props> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-md">
      <div className="flex gap-2 items-center sticky top-0 bg-neutral-900 z-10 py-3 px-5 border-b border-neutral-800 rounded-t-md">
        <RiPlayListFill size={26} />
        <h1 className="text-xl font-semibold text-white select-none">Songs Library</h1>
      </div>

      <div className="overflow-auto flex-1 p-2 space-y-3">
        {songs.length === 0 && <p className="text-neutral-400 text-center">No songs found.</p>}
        {songs.map((song) => (
          <MediaItem key={song.id} data={song} onClick={onPlay} />
        ))}
      </div>
    </div>
  );
};

export default DashboardLibrary;
