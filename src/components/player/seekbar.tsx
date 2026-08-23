import usePlayer from "@/hooks/player/use-player";
import { Slider } from "../ui/slider";
import { useState } from "react";
import { formatDuration } from "@/lib/format/duration";

export function Seekbar() {
  const progress = usePlayer((state) => state.progress);
  const duration = usePlayer((state) => state.duration);
  const activeId = usePlayer((state) => state.activeId);
  const requestSeek = usePlayer((state) => state.requestSeek);
  const [scrubbing, setScrubbing] = useState<number | null>(null);

  const shown = scrubbing ?? progress * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-left text-xs text-muted-foreground tabular-nums">
        {formatDuration((shown / 100) * duration)}
      </span>
      <Slider
        value={[shown]}
        max={100}
        step={0.1}
        disabled={!duration || !activeId}
        onValueChange={([value]) => setScrubbing(value)}
        onValueCommit={([value]) => {
          if (activeId) requestSeek(activeId, value / 100);
          setScrubbing(null);
        }}
        className="flex"
      />
      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        {formatDuration(duration)}
      </span>
    </div>
  );
}
