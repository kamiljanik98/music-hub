import Block from "../common/Block";
import Button from "../common/Button";
import { FaPlay, FaDownload } from "react-icons/fa6";

const Item = ({ i }: {i: any}) => {
  return (
    <Block key={i} className="md:min-w-full bg-neutral-800 p-3 md:p-4 rounded-lg flex items-center gap-x-4 md:gap-x-4 md:w-fit">
      <img
        className="w-12 h-12 md:w-10 md:h-10 rounded-md object-cover" 
        src="https://images.squarespace-cdn.com/content/v1/5f2db84743c1761f87232471/1612901490539-DH9SKPMUIYW3N8B2Z4GJ/So+You+Fell+In+Love+v3.jpg" alt="Song Image"
      />
      <div className="flex items-center justify-between w-full gap-x-2 md:gap-x-4">
        <div>
          <p className="text-sm text-neutral-400 truncate">Artist Name</p>
          <h1 className="text-sm md:text-sm font-bold text-white truncate">Song Name</h1>
        </div>
        <div className="flex items-center gap-x-2 md:gap-x-4">
          <Button className="w-fit p-1 md:p-2 hover:bg-green-500 rounded-full cursor-pointer hover:scale-110 transition text-white">
            <FaPlay size={14} className="md:size-4 size-5 " />
          </Button>
          <Button className="w-fit ml-1 mr-2 p-1 md:p-2 cursor-pointer">
            <FaDownload size={14} className="md:size-4 size-5 " />
          </Button>
        </div>
      </div>
    </Block>
  )
}

export default Item;