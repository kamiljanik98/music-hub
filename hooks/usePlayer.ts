import { create } from 'zustand';

export type AudioFile = {
  id: number;
  title: string;
  path: string;
  duration: number;
  created_at: string;
  uploaded_by: string;
  cover_url: string | null;
};

export type AudioUrl = {
  file: AudioFile;
  url: string | null;
};

interface PlayerState {
  audioFiles: AudioFile[];
  audioUrls: AudioUrl[];
  currentIndex: number;
  isMuted: boolean;
  playerReady: boolean;
  error: string | null;
  wavesurfer: any;
  setAudioFiles: (files: AudioFile[]) => void;
  setAudioUrls: (urls: AudioUrl[]) => void;
  setCurrentIndex: (idx: number) => void;
  setIsMuted: (muted: boolean) => void;
  setPlayerReady: (ready: boolean) => void;
  setError: (err: string | null) => void;
  setWavesurfer: (ws: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handlePlayPause: () => void;
  handleMute: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  audioFiles: [],
  audioUrls: [],
  currentIndex: 0,
  isMuted: false,
  playerReady: false,
  error: null,
  wavesurfer: null,

  setAudioFiles: (files) => set({ audioFiles: files }),
  setAudioUrls: (urls) => set({ audioUrls: urls }),
  setCurrentIndex: (idx) => set({ currentIndex: idx }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setPlayerReady: (ready) => set({ playerReady: ready }),
  setError: (err) => set({ error: err }),
  setWavesurfer: (ws) => set({ wavesurfer: ws }),

  handleNext: () => {
    const { audioFiles, currentIndex, setCurrentIndex } = get();
    if (!audioFiles.length) return;
    setCurrentIndex((currentIndex + 1) % audioFiles.length);
  },
  handlePrevious: () => {
    const { audioFiles, currentIndex, setCurrentIndex } = get();
    if (!audioFiles.length) return;
    setCurrentIndex((currentIndex - 1 + audioFiles.length) % audioFiles.length);
  },
  handlePlayPause: () => {
    const { wavesurfer } = get();
    if (wavesurfer) wavesurfer.playPause();
  },
  handleMute: () => {
    const { isMuted, setIsMuted, wavesurfer } = get();
    setIsMuted(!isMuted);
    if (wavesurfer) wavesurfer.setMuted(!isMuted);
  },
})); 