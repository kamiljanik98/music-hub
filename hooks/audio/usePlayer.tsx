'use client';

import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { useAudioFiles } from "./getAudioFiles";
import { useAudioUrls } from "./getAudioUrls";

export interface AudioPlayerContextValue {
  containerRef: React.RefObject<HTMLDivElement | null>;
  audioFiles: any[];
  audioUrls: { file: any; url: string | null }[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  wavesurfer: any;
  currentTrackUrl: string | null;
  currentTrack: any;
  loading: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  handlePlayPause: () => void;
  handleMute: () => void;
  isMuted: boolean;
  playerReady: boolean;
}

export const PlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export const MyPlayerContextProvider = (props: { children: React.ReactNode }) => {
  // --- Player state logic (copied from usePlayer) ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // Fetch audio files and their URLs
  const { audioFiles, loading } = useAudioFiles();
  const audioUrls = useAudioUrls(audioFiles);

  // Get the current track and its URL
  const currentAudio = audioUrls[currentIndex];
  const currentTrackUrl = currentAudio?.url ?? null;
  const currentTrack = currentAudio?.file ?? null;

  // Only initialize wavesurfer when container and url are ready
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    url: currentTrackUrl ?? undefined,
    height: 75,
    barWidth: 4,
    barGap: 2,
    barRadius: 2,
    barHeight: 1.25,
  });

  useEffect(() => {
    if (!wavesurfer) {
      setPlayerReady(false);
      return;
    }

    const onReady = () => setPlayerReady(true);
    const onDestroy = () => setPlayerReady(false);

    wavesurfer.on("ready", onReady);
    wavesurfer.on("destroy", onDestroy);

    // Clean up listeners only (not the instance)
    return () => {
      wavesurfer.un("ready", onReady);
      wavesurfer.un("destroy", onDestroy);
    };
  }, [wavesurfer]);

  // When the track changes, set playerReady to false until ready again
  useEffect(() => {
    setPlayerReady(false);
  }, [currentTrackUrl]);

  useEffect(() => {
    if (currentTrackUrl) {
      console.log("Current audio URL:", currentTrackUrl);
    }
  }, [currentTrackUrl]);

  // Controls
  const handleNext = useCallback(() => {
    if (!audioFiles.length) return;
    setCurrentIndex((index) => (index + 1) % audioFiles.length);
  }, [audioFiles.length]);

  const handlePrevious = useCallback(() => {
    if (!audioFiles.length) return;
    setCurrentIndex((index) => (index - 1 + audioFiles.length) % audioFiles.length);
  }, [audioFiles.length]);

  const handlePlayPause = useCallback(() => {
    if (!wavesurfer) {
      console.log("Wavesurfer is not initialized");
      return;
    }
    console.log("Attempting to play/pause. Current state:", wavesurfer.isPlaying());
    wavesurfer.playPause();
  }, [wavesurfer]);

  const handleMute = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.setMuted(!isMuted);
      setIsMuted((m) => !m);
    }
  }, [wavesurfer, isMuted]);

  const value: AudioPlayerContextValue = {
    containerRef,
    audioFiles,
    audioUrls,
    currentIndex,
    setCurrentIndex,
    wavesurfer,
    currentTrackUrl,
    currentTrack,
    loading,
    playerReady,
    handleNext,
    handlePrevious,
    handlePlayPause,
    handleMute,
    isMuted,
  };

  return <PlayerContext.Provider value={value} {...props} />;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};