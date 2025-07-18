'use client';

import Controls from "./Controls";
import Image from "next/image";
import { Waveform } from "./Waveform";
import { AudioData } from "../audio/AudioData";
import { usePlayer } from "@/hooks/audio/usePlayer";

function Player() {
  const { loading, audioUrls, currentTrack, containerRef } = usePlayer();

  if (loading) return <div>Loading...</div>;
  if (!audioUrls.length || !currentTrack) return <div>No audio files found.</div>;

  return (
      <div className="flex items-center w-full bg-neutral-900 rounded-lg p-4 md:pr-6 md:p-3 shadow-lg bottom-0 left-0  justify-between">
        <div className="rounded-lg flex gap-2 items-center">
          <Image 
            src={currentTrack.cover_url || "https://www.vibe.com/wp-content/uploads/2025/04/GnpM1C_aYAAOYEm.jpeg?w=935"}
            alt="Current Song" 
            className="w-10 h-10 md:w-10 md:h-10 rounded-lg mr-2 md:mr-3 object-cover" 
            width={40} 
            height={40} 
            />
          <AudioData uploadedBy={currentTrack.uploaded_by} title={currentTrack.title} />
        </div>
        <div className='w-full h-auto mb-2 overflow-hidden rounded flex items-center'>
          <Waveform containerRef={containerRef} />
        </div>
        <Controls />
      </div>
  );
}

export default Player;