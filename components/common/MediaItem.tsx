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
      className="flex flex-wrap items-center gap-x-16 gap-y-2 text-xs text-neutral-500 cursor-pointer hover:bg-neutral-700/25 w-full p-2 rounded-md"
    >
      <div className="flex gap-4 items-center min-w-0">
        <div className="relative rounded-md min-h-[48px] min-w-[48px]">
          <Image
            fill
            className="w-12 h-12 md:w-10 md:h-10 rounded-md object-cover"
            src={data.image_path || "/default-cover.jpg"}
            alt="Song Image"
          />
        </div>
        <div className="flex flex-col gap-y-0.5 min-w-0">
          <p className="text-white text-sm truncate max-w-[120px] sm:max-w-[150px]">
            {truncateText(data.title, 15)}
          </p>
          <p className="text-neutral-400 text-sm truncate max-w-[150px] sm:max-w-[200px]">
            {truncateText(data.profiles?.nickname || "Unknown", 30)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-y-2">
        <div className="flex-shrink-0 w-[60px] sm:w-[120px] truncate">
          <p className="truncate">{data.genre ?? "unknown"}</p>
        </div>
        <div className="flex-shrink-0 w-[50px] sm:w-[100px] truncate">
          <p className="truncate">{data.scale ?? "unknown"}</p>
        </div>
        <div className="flex-shrink-0 w-[60px] sm:w-[100px] truncate">
          <p className="truncate">{data.bpm ?? "unknown"} BPM</p>
        </div>
        <div className="flex-grow max-w-[150px] sm:max-w-[200px] truncate">
          <p className="truncate">{(data.tags ?? []).map((tag) => `#${tag}`).join(" ")}</p>
        </div>
      </div>
    </div>
  );
};

export default MediaItem;
