"use client"

import { cn } from "@/lib/utils"

export function LavaLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-2xl",
  }

  return (
    <div
      className={cn(
        "lava-gradient-bg rounded-xl flex items-center justify-center font-bold text-white shadow-lg",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="w-2/3 h-2/3"
        aria-hidden="true"
      >
        <path
          d="M16 2C16 2 8 12 8 20C8 24.4 11.6 28 16 28C20.4 28 24 24.4 24 20C24 12 16 2 16 2Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M16 10C16 10 12 16 12 20C12 22.2 13.8 24 16 24C18.2 24 20 22.2 20 20C20 16 16 10 16 10Z"
          fill="#FF6B35"
        />
        <path
          d="M16 16C16 16 14 18.5 14 20C14 21.1 14.9 22 16 22C17.1 22 18 21.1 18 20C18 18.5 16 16 16 16Z"
          fill="#D62828"
        />
      </svg>
    </div>
  )
}

export function LavaLogoWithText({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <div className="flex items-center gap-3">
      <LavaLogo size={size} />
      <div>
        <h1 className={cn("font-bold lava-gradient-text tracking-tight", textSizes[size])}>
          LAVA
        </h1>
        <p className="text-muted-foreground text-xs tracking-widest uppercase">
          Training Rater
        </p>
      </div>
    </div>
  )
}
