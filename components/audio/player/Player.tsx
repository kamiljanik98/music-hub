'use client';

import Controls from "./Controls";
import Image from "next/image";
import Waveform from "./Waveform";
import { TrackInfo } from "../library/TrackInfo";
import { usePlayer } from "@/hooks/usePlayer";
import React from "react";

const Player = () => {
  const { audioFiles, currentIndex, audioUrls, playerReady, error } = usePlayer();
  const currentTrack = audioFiles[currentIndex];
  const currentTrackUrl = audioUrls[currentIndex]?.url ?? null;

  if (!audioFiles.length) return <div>No audio files found.</div>;
  if (error) return <div className="text-xs text-red-400 ml-2">{error}</div>;

  const uploadedBy: string | null = (currentTrack && (currentTrack as any).nickname)
    || (currentTrack && (currentTrack as any).uploaded_by)
    || null;
  const coverUrl = currentTrack && currentTrack.cover_url
    ? currentTrack.cover_url
    : "https://www.vibe.com/wp-content/uploads/2025/04/GnpM1C_aYAAOYEm.jpeg?w=935";
  const title = currentTrack && currentTrack.title ? currentTrack.title : 'Unknown Title';

  return (
    <div className="flex items-center w-full bg-neutral-900 rounded-lg p-4 md:pr-6 md:p-3 shadow-lg bottom-0 left-0  justify-between">
      <div className="rounded-lg flex gap-2 items-center">
        <Image 
          src={coverUrl}
          alt="Current Song" 
          className="w-10 h-10 md:w-10 md:h-10 rounded-lg mr-2 md:mr-3 object-cover" 
          width={40} 
          height={40} 
        />
        <TrackInfo uploadedBy={uploadedBy} title={title} />
      </div>
      <div className='w-[50%] h-auto mb-2 overflow-hidden rounded flex items-center' style={{ position: 'relative' }}>
        <Waveform url={currentTrackUrl} />
        {!playerReady && (
          <p className="text-green-500 w-full absolute left-0 top-0 bg-neutral-900/80 flex items-center justify-center h-full z-10">
            Loading Waveform...
          </p>
        )}
      </div>
      <Controls />
    </div>
  );
};

export default Player;