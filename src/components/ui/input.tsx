import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full min-w-0 text-xs outline-none transition-colors duration-200 placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        underline:
          "bg-transparent px-0 py-2 border-0 border-b border-input focus:border-ring/60",
        filled:
          "rounded-md border border-input bg-[rgba(0,0,0,0.3)] px-4 py-3 text-sm focus:border-ring/60",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

function Input({ className, type, variant, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Input };
