import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { usePlayer } from "@/hooks/usePlayer";

interface WaveformProps {
  url: string | null;
}

const Waveform: React.FC<WaveformProps> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setWavesurfer = usePlayer((s) => s.setWavesurfer);

  useEffect(() => {
    if (!url || !containerRef.current) return;
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#ccc",
      progressColor: "#333",
      height: 75,
      barWidth: 4,
      barGap: 2,
      barRadius: 2,
      barHeight: 1.25,
    });
    ws.load(url);
    setWavesurfer(ws);

    return () => {
      ws.destroy();
      setWavesurfer(null);
    };
  }, [url, setWavesurfer]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default Waveform;