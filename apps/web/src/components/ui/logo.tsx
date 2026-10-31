import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
}

export function CyberPlusLogo({
  className,
  size = 28,
  width,
  height,
  alt = "CyberPlus",
  priority = false,
}: LogoProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={w}
      height={h}
      sizes={`${w}px`}
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
      priority={priority}
    />
  );
}
