import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  plusColor?: string;
  shieldColor?: string;
}

export function CyberPlusLogo({
  className,
  size = 24,
  plusColor,
  shieldColor,
  ...props
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Outer Shield */}
      <path
        d="M50 12 C38 17 26 21 18 24 L18 52 C18 72 34 84 50 91 C66 84 82 72 82 52 L82 24 C74 21 62 17 50 12 Z"
        stroke={shieldColor || "currentColor"}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Centered Plus */}
      <path
        d="M50 36 V64 M36 50 H64"
        stroke={plusColor || "currentColor"}
        strokeWidth="8.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
