import Header from "../common/Header";
import Item from "./Item";

const Library = () => {
  return (
      <div className="flex flex-col flex-1 min-h-0 w-full gap-y-2 md:gap-y-4 overflow-y-auto p-4 md:p-4 md:pb-4 bg-neutral-900 rounded-lg">
        <Header title="Recent Uploads" />
        <div className="flex  flex-col gap-y-2 md:gap-y-2">
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((i) => (
            <Item i={i} key={i} />
          ))}
        </div>
      </div>
  )
}

export default Library;