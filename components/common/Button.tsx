import { FC } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="bg-neutral-800 rounded-lg p-2 w-full cursor-pointer flex items-center gap-2 justify-center"
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;