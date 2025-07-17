import { FaBackward, FaForward, FaPlay, FaVolumeLow, FaDownload } from "react-icons/fa6";
import Button from "../common/Button";

const Player = () => {
  return (
    <div className="flex items-center w-full bg-neutral-900 rounded-lg p-4 md:pr-6 md:p-3 shadow-lg bottom-0 left-0  justify-between">
      <div className="rounded-lg flex gap-2 items-center">
        <img src="https://images.squarespace-cdn.com/content/v1/5f2db84743c1761f87232471/1612901490539-DH9SKPMUIYW3N8B2Z4GJ/So+You+Fell+In+Love+v3.jpg" alt="Current Song" className="w-10 h-10 md:w-10 md:h-10 rounded-lg mr-2 md:mr-3 object-cover" />
        <div>
          <div className="text-xs md:text-sm text-neutral-400">Artist Name</div>
          <div className="text-sm md:text-lg text-white font-semibold leading-tight">Song Name</div>
        </div>
      </div>
        <div className="flex gap-x-4 md:gap-x-4 items-center">
          <FaBackward size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" />
          <Button className="cursor-pointer text-white rounded-full flex items-center justify-center">
            <FaPlay size={24} className="md:size-4 size-5" />
          </Button>
          <FaForward size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" />
          <FaVolumeLow size={24} className="md:size-4 size-5 text-neutral-400 cursor-pointer hover:text-white transition" />
        </div>
    </div>
  )
}

export default Player;