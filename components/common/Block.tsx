import { FC } from "react";

const Block: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="rounded-lg w-full flex flex-col items-center gap-2 justify-center" {...props}>
      {children}
    </div>
  )
}

export default Block;