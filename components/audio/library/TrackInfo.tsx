import React from "react";
import { truncateText } from "@/utils/truncate";

interface TrackInfoProps {
  uploadedBy: string | null;
  title: string;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ uploadedBy, title }) => (
  <div>
    <p className="text-xs md:text-sm text-neutral-400 w-full">
      {truncateText(uploadedBy ? uploadedBy : "unknown", 10)}
    </p>
    <p className="text-sm md:text-sm text-white font-semibold leading-tight">
      {truncateText(title, 10)}
    </p>
  </div>
); 