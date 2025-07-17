import { FC } from "react";

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {}

const Block: FC<BlockProps> = ({ children, ...props }) => {
  return (
    <div className="rounded-lg w-full flex flex-col items-center gap-2 justify-center" {...props}>
      {children}
    </div>
  )
}

export default Block;