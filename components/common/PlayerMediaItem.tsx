"use client";

import { Song } from "@/types";
import { FC } from "react";
import Image from "next/image";
import { truncateText } from "@/utils/truncate";

interface PlayerMediaItemProps {
  data: Song;
}

const PlayerMediaItem: FC<PlayerMediaItemProps> = ({ data }) => {
  return (
    <div className="flex items-center gap-x-24 text-xs text-neutral-500 w-full p-2 rounded-md">
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
          <p className="text-white text-sm truncate w-[120px]">{truncateText(data.title, 20)}</p>
          <p className="text-neutral-400 text-sm truncate w-[150px]">
            {truncateText(data.profiles?.nickname || "Unknown", 20)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerMediaItem;
