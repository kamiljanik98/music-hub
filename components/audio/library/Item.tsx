import Button from "../../common/Button";
import { FaPlay, FaDownload } from "react-icons/fa6";
import Image from "next/image";
import { AudioFile } from "@/hooks/usePlayer";

type ItemProps = {
  file: AudioFile;
  onPlay: () => void;
};

const Item: React.FC<ItemProps> = ({ file, onPlay }) => (
  <div key={file.id} className="md:min-w-full bg-neutral-950/50 p-3 md:p-4 rounded-lg flex items-center gap-x-4 md:gap-x-4 md:w-fit">
    <Image
      className="w-12 h-12 md:w-10 md:h-10 rounded-md object-cover"
      src={file.cover_url || '/default-cover.jpg'}
      alt="Song Image"
      width={48}
      height={48}
    />
    <div className="flex items-center justify-between w-full gap-x-2 md:gap-x-4">
      <div>
        <p className="text-sm text-neutral-400 truncate">{file.uploaded_by}</p>
        <h1 className="text-sm md:text-sm font-bold text-white truncate">{file.title}</h1>
      </div>
      <div className="flex items-center gap-x-2 md:gap-x-4">
        <Button onClick={onPlay} className="w-fit p-1 md:p-2 hover:bg-green-500 rounded-full cursor-pointer hover:scale-110 transition text-white">
          <FaPlay size={14} className="md:size-4 size-5 " />
        </Button>
        <Button className="w-fit ml-1 mr-2 p-1 md:p-2 cursor-pointer">
          <FaDownload size={14} className="md:size-4 size-5 " />
        </Button>
      </div>
    </div>
  </div>
);

export default Item;