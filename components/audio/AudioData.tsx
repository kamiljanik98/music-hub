import React from "react";

interface AudioDataProps {
  uploadedBy: string;
  title: string;
}

export const AudioData: React.FC<AudioDataProps> = ({ uploadedBy, title }) => (
  <div>
    <p className="text-xs md:text-sm text-neutral-400">{uploadedBy}</p>
    <p className="text-sm md:text-sm text-white font-semibold leading-tight">{title}</p>
  </div>
); 