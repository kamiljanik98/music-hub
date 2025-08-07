import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", disabled, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={twMerge(
            `
              block
              w-full
              rounded-lg
              bg-neutral-800
              border
              border-neutral-700
              py-2.5
              text-base
              text-white
              placeholder:text-neutral-500
              transition
              duration-200
              ease-in-out
              disabled:cursor-not-allowed
              disabled:opacity-50
              focus:outline-none
              focus:border-green-500
              ${icon ? " pl-10" : "pl-4"}
            `,
            className,
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
