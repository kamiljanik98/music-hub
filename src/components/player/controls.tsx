"use client";

import { useCallback, useEffect, useRef } from "react";
import usePlayer from "@/hooks/player/use-player";
import { useLoadSongUrl } from "@/hooks/songs/use-load-song-url";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";

const SILENT_PLAY_ERRORS = ["NotAllowedError", "NotSupportedError"];

function playErrorMessage(error: unknown): string | null {
  if (error instanceof DOMException && SILENT_PLAY_ERRORS.includes(error.name))
    return null;
  return "Playback failed";
}

function mediaErrorMessage(error: MediaError | null): string | null {
  if (!error || error.code === MediaError.MEDIA_ERR_ABORTED) return null;
  if (error.code === MediaError.MEDIA_ERR_NETWORK)
    return "Lost connection while loading this track";
  if (error.code === MediaError.MEDIA_ERR_DECODE)
    return "This track's audio file is corrupted";
  return "This track's format isn't supported by your browser";
}

interface ControlsProps {
  song: Song;
}

export function Controls({ song }: ControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const setIsPlaying = usePlayer((s) => s.setIsPlaying);
  const setProgress = usePlayer((s) => s.setProgress);
  const setDuration = usePlayer((s) => s.setDuration);
  const duration = usePlayer((s) => s.duration);
  const seekTo = usePlayer((s) => s.seekTo);
  const clearSeekRequest = usePlayer((s) => s.clearSeekRequest);
  const activeId = usePlayer((state) => state.activeId);
  const ids = usePlayer((state) => state.ids);
  const setActiveId = usePlayer((state) => state.setActiveId);
  const volume = usePlayer((state) => state.volume);
  const repeatMode = usePlayer((state) => state.repeatMode);
  const playPauseRequested = usePlayer((state) => state.playPauseRequested);
  const clearPlayPauseRequest = usePlayer(
    (state) => state.clearPlayPauseRequest,
  );

  const { url, error: loadError } = useLoadSongUrl(song.path);

  const attemptPlay = useCallback(() => {
    audioRef.current?.play().catch((error: unknown) => {
      setIsPlaying(false);
      const message = playErrorMessage(error);
      if (message) toast.error(message);
    });
  }, [setIsPlaying]);

  const restart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    attemptPlay();
  }, [attemptPlay]);

  const handleNext = useCallback(() => {
    if (!ids.length || !activeId) return;
    const currentIndex = ids.indexOf(activeId);
    const nextId = ids[currentIndex + 1];

    if (nextId) {
      setActiveId(nextId);
      return;
    }

    if (repeatMode === "all") {
      if (ids[0] === activeId) {
        restart();
        return;
      }
      setActiveId(ids[0]);
    }
  }, [ids, activeId, repeatMode, setActiveId, restart]);

  const handlePrev = useCallback(() => {
    if (!ids.length || !activeId) return;
    const currentIndex = ids.indexOf(activeId);
    const prevId = ids[currentIndex - 1] ?? ids[ids.length - 1];
    setActiveId(prevId);
  }, [ids, activeId, setActiveId]);

  useEffect(() => {
    if (!loadError) return;
    setIsPlaying(false);
    toast.error("Couldn't load this track");
  }, [loadError, setIsPlaying]);

  useEffect(() => {
    if (!audioRef.current || !url) return;
    audioRef.current.src = url;
    attemptPlay();
  }, [url, attemptPlay]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (seekTo === null || !audioRef.current || !duration) return;
    if (seekTo.songId !== activeId) {
      clearSeekRequest();
      return;
    }
    audioRef.current.currentTime = seekTo.progress * duration;
    clearSeekRequest();
  }, [activeId, seekTo, clearSeekRequest, duration]);

  useEffect(() => {
    if (playPauseRequested === false || !audioRef.current) return;
    if (audioRef.current.paused) {
      attemptPlay();
    } else {
      audioRef.current.pause();
    }
    clearPlayPauseRequest();
  }, [playPauseRequested, clearPlayPauseRequest, attemptPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      attemptPlay();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <audio
        ref={audioRef}
        className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (repeatMode === "one") {
            restart();
            return;
          }

          setIsPlaying(false);
          handleNext();
        }}
        onError={(e) => {
          setIsPlaying(false);
          const message = mediaErrorMessage(e.currentTarget.error);
          if (message) toast.error(message);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgress(el.currentTime / el.duration);
        }}
      />

      <button
        onClick={handlePrev}
        className="text-neutral-300 transition-opacity hover:opacity-80 hover:text-foreground"
        aria-label="Previous"
      >
        <SkipBack className="size-4" fill="currentColor" />
      </button>

      <button
        onClick={togglePlay}
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground transition-opacity hover:opacity-80",
        )}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="size-4" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 size-4" fill="currentColor" />
        )}
      </button>

      <button
        onClick={handleNext}
        className="text-neutral-300 transition-opacity hover:opacity-80 hover:text-foreground"
        aria-label="Next"
      >
        <SkipForward className="size-4" fill="currentColor" />
      </button>
    </div>
  );
}
