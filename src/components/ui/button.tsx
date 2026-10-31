import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-normal transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3e6ae1] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        /* Primary CTA - Tesla Electric Cobalt Blue "Order Now" button */
        default: "bg-[#3e6ae1] text-white hover:bg-[#3457d5] active:bg-[#2945b5] shadow-xs",
        /* Secondary CTA - Tesla Crisp White "Learn More" button */
        secondary: "bg-white text-[#171a20] hover:bg-[#f4f4f4] border border-[#d0d1d2] shadow-2xs",
        /* Tesla inverted */
        tesla: "bg-[#171a20] text-white hover:bg-[#393c41] font-medium shadow-xs",
        destructive: "bg-[#171a20] text-white hover:bg-[#393c41] shadow-xs",
        outline: "border border-[#d0d1d2] text-[#171a20] hover:bg-[#f4f4f4] bg-transparent",
        ghost: "text-[#5c5e62] hover:text-[#171a20] hover:bg-[#f4f4f4]",
        link: "text-[#3e6ae1] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-11 px-7 text-sm font-medium",
        xl: "h-12 px-8 text-base font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
