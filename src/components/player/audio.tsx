"use client";

import { useCallback, useEffect, useRef } from "react";
import usePlayer from "@/hooks/player/use-player";
import { recordPlay } from "@/actions/songs/record-play";
import { useLoadSongUrl } from "@/hooks/songs/use-load-song-url";
import { toast } from "sonner";
import type { Song } from "@/types";

const SILENT_PLAY_ERRORS = ["NotAllowedError", "NotSupportedError"];
const PLAY_THRESHOLD_MS = 15_000;

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

export function Audio({ song }: { song: Song }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setIsPlaying = usePlayer((s) => s.setIsPlaying);
  const setProgress = usePlayer((s) => s.setProgress);
  const setDuration = usePlayer((s) => s.setDuration);
  const duration = usePlayer((s) => s.duration);
  const seekTo = usePlayer((s) => s.seekTo);
  const clearSeekRequest = usePlayer((s) => s.clearSeekRequest);
  const activeId = usePlayer((s) => s.activeId);
  const ids = usePlayer((s) => s.ids);
  const setActiveId = usePlayer((s) => s.setActiveId);
  const volume = usePlayer((s) => s.volume);
  const playbackRate = usePlayer((s) => s.playbackRate);
  const repeatMode = usePlayer((s) => s.repeatMode);
  const playPauseRequested = usePlayer((s) => s.playPauseRequested);
  const clearPlayPauseRequest = usePlayer((s) => s.clearPlayPauseRequest);

  const { url, error: loadError } = useLoadSongUrl(song.path);

  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRecordedRef = useRef(false);

  const clearPlayTimer = useCallback(() => {
    if (playTimerRef.current === null) return;
    clearTimeout(playTimerRef.current);
    playTimerRef.current = null;
  }, []);

  const startPlayTimer = useCallback(() => {
    if (hasRecordedRef.current || playTimerRef.current !== null) return;

    playTimerRef.current = setTimeout(() => {
      playTimerRef.current = null;
      hasRecordedRef.current = true;
      void recordPlay(song.id);
    }, PLAY_THRESHOLD_MS);
  }, [song.id]);

  const attemptPlay = useCallback(() => {
    audioRef.current?.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;

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

  useEffect(() => {
    if (!loadError) return;
    setIsPlaying(false);
    toast.error("Couldn't load this track");
  }, [loadError, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    audio.src = url;
    attemptPlay();
  }, [url, attemptPlay]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.defaultPlaybackRate = playbackRate;
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate, url]);

  useEffect(() => {
    hasRecordedRef.current = false;
    return clearPlayTimer;
  }, [song.id, clearPlayTimer]);

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

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      audio?.pause();
      if (audio) audio.src = "";
      clearPlayTimer();
    };
  }, [clearPlayTimer]);

  return (
    <audio
      ref={audioRef}
      className="hidden"
      onPlay={() => {
        setIsPlaying(true);
        startPlayTimer();
      }}
      onPause={() => {
        setIsPlaying(false);
        clearPlayTimer();
      }}
      onEnded={() => {
        clearPlayTimer();

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
        const audio = e.currentTarget;
        if (audio.duration) setProgress(audio.currentTime / audio.duration);
      }}
    />
  );
}
