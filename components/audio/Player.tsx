'use client';

import { FaBackward, FaForward, FaPlay, FaVolumeLow } from "react-icons/fa6";
import Button from "../common/Button";
import Image from "next/image";
import { useWavesurfer } from '@wavesurfer/react';
import { useCallback, useEffect, useRef, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

type AudioFile = {
  id: number;
  title: string;
  path: string;
  duration: number;
  created_at: string;
  uploaded_by: string;
};

const Player = () => {
  const containerRef = useRef(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [urlIndex, setUrlIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);

  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('audio_files')
        .select('id, title, path, duration, created_at, uploaded_by')
        .order('created_at', { ascending: false });
      if (!data || error) {
        setAudioFiles([]);
        setLoading(false);
        return;
      }
      setAudioFiles(data);
      setUrlIndex(0);
      setLoading(false);
    })();
  }, [supabaseClient]);

  useEffect(() => {
    if (!audioFiles.length) {
      setAudioUrl(null);
      return;
    }
    const currentFile = audioFiles[urlIndex];
    if (!currentFile) {
      setAudioUrl(null);
      return;
    }
    const { data: urlData } = supabaseClient
      .storage
      .from('audio')
      .getPublicUrl(currentFile.path);
    setAudioUrl(urlData?.publicUrl || null);
  }, [audioFiles, urlIndex, supabaseClient]);

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 75,
    barWidth: 2,
    url: audioUrl ?? undefined,
    barGap: 2,
    barRadius: 2,
    barHeight: 0.75,
  });

  const handleNext = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioFiles.length);
  }, [audioFiles.length]);

  const handlePrev = useCallback(() => {
    setUrlIndex((index) => (index - 1 + audioFiles.length) % audioFiles.length);
  }, [audioFiles.length]);

  const handlePlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const handleMute = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.setMuted(!muted);
      setMuted((m) => !m);
    }
  }, [wavesurfer, muted]);

  if (loading) return <div>Loading...</div>;
  if (!audioFiles.length) return <div>No audio files found.</div>;
  const currentFile = audioFiles[urlIndex];

  return (
    <div className="flex items-center w-full bg-neutral-900 rounded-lg p-4 md:pr-6 md:p-3 shadow-lg bottom-0 left-0  justify-between">
      <div className="rounded-lg flex gap-2 items-center">
        <Image 
          src="https://www.vibe.com/wp-content/uploads/2025/04/GnpM1C_aYAAOYEm.jpeg?w=935"
          alt="Current Song" 
          className="w-10 h-10 md:w-10 md:h-10 rounded-lg mr-2 md:mr-3 object-cover" 
          width={40} 
          height={40} 
        />
        <div>
          <p className="text-xs md:text-sm text-neutral-400">
            {currentFile.uploaded_by}
          </p>
          <p className="text-sm md:text-lg text-white font-semibold leading-tight">{currentFile.title}</p>
        </div>
      </div>
      <div className='w-full h-auto mb-2 overflow-hidden rounded flex items-center'>
        <div ref={containerRef} className='w-full h-full' />
      </div>
      <div className="flex gap-x-4 md:gap-x-4 items-center">
        <FaBackward size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" onClick={handlePrev} />
        <Button 
          onClick={handlePlayPause}
          className="cursor-pointer text-white rounded-full flex items-center justify-center"
        >
          <FaPlay size={24} className="md:size-4 size-5" />
        </Button>
        <FaForward size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" onClick={handleNext} />
        <Button onClick={handleMute}>
          <FaVolumeLow
            size={24}
            className={`md:size-4 size-5 cursor-pointer transition ${muted ? 'text-red-500' : 'text-neutral-400 hover:text-white'}`}
          />
        </Button>
      </div>
    </div>
  );
}

export default Player;