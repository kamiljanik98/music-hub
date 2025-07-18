import { FaBackward, FaForward, FaPlay, FaVolumeLow } from "react-icons/fa6";
import Button from "../common/Button";
import { usePlayer } from "@/hooks/audio/usePlayer";

const Controls = () => {
  const { handleNext, handlePrevious, handlePlayPause, handleMute, isMuted, playerReady } = usePlayer();
  const disabled = !playerReady;

  return (
    <div className="flex gap-x-4 md:gap-x-4 items-center">
      <Button onClick={handlePrevious} disabled={disabled}>
        <FaBackward size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" />
      </Button>
      <Button onClick={handlePlayPause} disabled={disabled}>
        <FaPlay size={24} className="md:size-4 size-5 text-white" />
      </Button>
      <Button onClick={handleNext} disabled={disabled}>
        <FaForward size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" />
      </Button>
      <Button onClick={handleMute} disabled={disabled}>
        <FaVolumeLow
          size={24}
          className={`md:size-4 size-5 cursor-pointer transition ${isMuted ? 'text-red-500' : 'text-neutral-400 hover:text-white'}`}
        />
      </Button>
      {disabled && (
        <span className="text-xs text-red-400 ml-2">Player not ready</span>
      )}
    </div>
  );
};

export default Controls;