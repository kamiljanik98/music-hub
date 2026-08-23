"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import usePlayer from "@/hooks/player/use-player";
import { resolveSongUrl } from "@/actions/songs/resolve-song-url";

type UseWaveformOptions = {
  songId: string;
  path: string;
  height: number;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  lazyMount?: boolean;
  onActivate?: (songId: string) => void;
};

export function useWaveform({
  songId,
  path,
  height,
  barWidth = 4,
  barGap = 4,
  barRadius = 4,
  lazyMount = true,
  onActivate,
}: UseWaveformOptions) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isVisible, setIsVisible] = useState(!lazyMount);

  const activeId = usePlayer((s) => s.activeId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const progress = usePlayer((s) => s.progress);
  const playbackRate = usePlayer((s) => s.playbackRate);
  const requestSeek = usePlayer((s) => s.requestSeek);

  const isActive = activeId === songId;

  useEffect(() => {
    if (!lazyMount || !rootRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [lazyMount]);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    let cancelled = false;

    const init = async () => {
      const { url, error } = await resolveSongUrl(path);

      if (cancelled || !containerRef.current || error || !url) {
        return;
      }

      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        url,
        waveColor: "rgba(255, 255, 255, 0.16)",
        progressColor: "#d6f24b",
        height,
        barWidth,
        barGap,
        barRadius,
        cursorWidth: 0,
        interact: false,
      });

      wavesurferRef.current.setPlaybackRate(playbackRate);
    };

    init();

    return () => {
      cancelled = true;
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [isVisible, path, height, barWidth, barGap, barRadius, playbackRate]);

  useEffect(() => {
    wavesurferRef.current?.setPlaybackRate(playbackRate);
  }, [playbackRate]);

  useEffect(() => {
    wavesurferRef.current?.seekTo(isActive ? progress : 0);
  }, [isActive, progress]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    if (!isActive) {
      onActivate?.(songId);
    }

    const rect = containerRef.current.getBoundingClientRect();

    requestSeek(songId, (e.clientX - rect.left) / rect.width);
  };

  return {
    rootRef,
    containerRef,
    isActive,
    isPlaying,
    handleClick,
  };
}
