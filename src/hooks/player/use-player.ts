import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SeekRequest = {
  songId: string;
  progress: number;
};

type RepeatMode = "off" | "all" | "one";

interface PlayerStore {
  ids: string[];
  activeId: string | null;
  volume: number;
  playbackRate: number;
  repeatMode: RepeatMode;
  isPlaying: boolean;
  progress: number;
  duration: number;
  seekTo: SeekRequest | null;
  playPauseRequested: boolean;

  setActiveId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  requestSeek: (songId: string, progress: number) => void;
  clearSeekRequest: () => void;
  requestPlayPause: () => void;
  clearPlayPauseRequest: () => void;
}

const usePlayer = create<PlayerStore>()(
  persist(
    (set) => ({
      ids: [],
      activeId: null,
      volume: 1,
      playbackRate: 1,
      repeatMode: "off",
      isPlaying: false,
      progress: 0,
      duration: 0,
      seekTo: null,
      playPauseRequested: false,

      setActiveId: (id) =>
        set({
          activeId: id,
          duration: 0,
          progress: 0,
        }),

      setIds: (ids) => set({ ids }),

      setVolume: (volume) => set({ volume }),

      setPlaybackRate: (playbackRate) =>
        set({
          playbackRate,
        }),

      setRepeatMode: (repeatMode) =>
        set({
          repeatMode,
        }),

      setIsPlaying: (isPlaying) =>
        set({
          isPlaying,
        }),

      setProgress: (progress) =>
        set({
          progress,
        }),

      setDuration: (duration) =>
        set({
          duration,
        }),

      requestSeek: (songId, progress) =>
        set({
          seekTo: {
            songId,
            progress,
          },
        }),

      clearSeekRequest: () =>
        set({
          seekTo: null,
        }),

      requestPlayPause: () =>
        set({
          playPauseRequested: true,
        }),

      clearPlayPauseRequest: () =>
        set({
          playPauseRequested: false,
        }),
    }),
    {
      name: "musichub-player",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        volume: state.volume,
        playbackRate: state.playbackRate,
        repeatMode: state.repeatMode,
      }),
    },
  ),
);

export default usePlayer;
