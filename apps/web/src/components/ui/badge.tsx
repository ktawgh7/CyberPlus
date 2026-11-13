import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#3e6ae1] text-white shadow-xs",
        secondary: "border-[#e2e2e2] bg-[#f4f4f4] text-[#171a20]",
        destructive: "border-transparent bg-[#171a20] text-white shadow-xs",
        outline: "border-[#d0d1d2] text-[#171a20] bg-transparent",
        success: "border-emerald-500/20 bg-emerald-50 text-emerald-700",
        warning: "border-amber-500/20 bg-amber-50 text-amber-700",
        info: "border-[#3e6ae1]/30 bg-[#3e6ae1]/10 text-[#3e6ae1]",
        prototype: "border-[#3e6ae1]/20 bg-[#3e6ae1]/10 text-[#3e6ae1] uppercase tracking-widest text-[11px] font-semibold",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
