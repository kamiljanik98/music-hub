"use client";

import { Song } from "@/types";
import { FC } from "react";
import Image from "next/image";
import { truncateText } from "@/utils/truncate";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
}

const MediaItem: FC<MediaItemProps> = ({ data, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      return onClick(String(data.id));
    }
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          fill
          className="w-12 h-12 md:w-10 md:h-10 rounded-md object-cover"
          src={data.image_path || "/default-cover.jpg"}
          alt="Song Image"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{truncateText(data.title, 35)}</p>
        <p className="text-neutral-400 text-sm truncate">{truncateText(data.uploaded_by, 10)}</p>
      </div>
    </div>
  );
};

export default MediaItem;
