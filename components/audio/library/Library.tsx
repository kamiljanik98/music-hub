import { usePlayer } from "@/hooks/usePlayer";
import Header from "../../common/Header";
import Item from "./Item";
import { AudioFile } from "@/hooks/usePlayer";

const Library = () => {
  const audioFiles = usePlayer((state) => state.audioFiles);
  const setCurrentIndex = usePlayer((state) => state.setCurrentIndex);

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full gap-y-2 md:gap-y-4 overflow-y-auto p-4 md:p-4 md:pb-4 bg-neutral-900 rounded-lg">
      <Header title="Recent Uploads" />
      <div className="flex flex-col gap-y-2 md:gap-y-2">
        {audioFiles.map((file: AudioFile, idx: number) => (
          <Item
            key={file.id}
            file={file}
            onPlay={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;