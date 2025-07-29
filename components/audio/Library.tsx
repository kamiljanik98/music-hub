"use client";
import { TbPlaylist } from "react-icons/tb";
import { Song } from "@/types";
import { FC } from "react";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps {
  songs: Song[];
}

const Library: FC<LibraryProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  return (
    <div className="flex flex-col gap-2 mr-2">
      <div className="flex items-center justify-between ">
        <div className="inline-flex items-center gap-x-2 top-2 bg-neutral-900 z-1 w-full p-4 rounded-lg">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {songs.map((song) => (
          <MediaItem key={song.id} data={song} onClick={() => onPlay(String(song.id))} />
        ))}
      </div>
    </div>
  );
};

export default Library;
