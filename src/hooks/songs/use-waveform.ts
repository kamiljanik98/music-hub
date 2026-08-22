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
  barWidth = 2,
  barGap = 2,
  barRadius = 2,
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
      if (cancelled || !containerRef.current || error || !url) return;

      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        url,
        waveColor: "#525252",
        progressColor: "#fafafa",
        height,
        barWidth,
        barGap,
        barRadius,
        cursorWidth: 0,
        interact: false,
      });
    };

    init();

    return () => {
      cancelled = true;
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [isVisible, path, height, barWidth, barGap, barRadius]);

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

  return { rootRef, containerRef, isActive, isPlaying, handleClick };
}
