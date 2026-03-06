"use client"

import { useEffect, useState } from "react"

const LOADING_MESSAGES = [
  "Connecting to carrier networks...",
  "Calculating risk factors...",
  "Applying coverage options...",
  "Running rate algorithms...",
  "Comparing across carriers...",
  "Applying available discounts...",
  "Finalizing premium calculations...",
]

export function LavaSpinner() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative">
        <div className="lava-spinner-lg" />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--lava-amber) 0%, transparent 70%)",
            animation: "lava-pulse 2s ease-in-out infinite",
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground mb-2">
          Generating Quotes
        </p>
        <p
          className="text-sm text-muted-foreground transition-opacity duration-300"
          key={messageIndex}
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  )
}
