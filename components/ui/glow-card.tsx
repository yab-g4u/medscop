"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: "blue" | "green" | "purple" | "red" | "cyan"
  intensity?: "low" | "medium" | "high"
  onClick?: () => void
}

export function GlowCard({ children, className, glowColor = "blue", intensity = "medium", onClick }: GlowCardProps) {
  const colorClasses = {
    blue: {
      low: "bg-gray-900/40 border-blue-500/20 hover:border-blue-500/40",
      medium: "bg-gray-900/60 border-blue-500/30 hover:border-blue-500/50 shadow-blue-500/10 hover:shadow-blue-500/20",
      high: "bg-gray-900/80 border-blue-500/50 hover:border-blue-500/70 shadow-blue-500/20 hover:shadow-blue-500/40",
    },
    green: {
      low: "bg-gray-900/40 border-green-500/20 hover:border-green-500/40",
      medium:
        "bg-gray-900/60 border-green-500/30 hover:border-green-500/50 shadow-green-500/10 hover:shadow-green-500/20",
      high: "bg-gray-900/80 border-green-500/50 hover:border-green-500/70 shadow-green-500/20 hover:shadow-green-500/40",
    },
    purple: {
      low: "bg-gray-900/40 border-purple-500/20 hover:border-purple-500/40",
      medium:
        "bg-gray-900/60 border-purple-500/30 hover:border-purple-500/50 shadow-purple-500/10 hover:shadow-purple-500/20",
      high: "bg-gray-900/80 border-purple-500/50 hover:border-purple-500/70 shadow-purple-500/20 hover:shadow-purple-500/40",
    },
    red: {
      low: "bg-gray-900/40 border-red-500/20 hover:border-red-500/40",
      medium: "bg-gray-900/60 border-red-500/30 hover:border-red-500/50 shadow-red-500/10 hover:shadow-red-500/20",
      high: "bg-gray-900/80 border-red-500/50 hover:border-red-500/70 shadow-red-500/20 hover:shadow-red-500/40",
    },
    cyan: {
      low: "bg-gray-900/40 border-cyan-500/20 hover:border-cyan-500/40",
      medium: "bg-gray-900/60 border-cyan-500/30 hover:border-cyan-500/50 shadow-cyan-500/10 hover:shadow-cyan-500/20",
      high: "bg-gray-900/80 border-cyan-500/50 hover:border-cyan-500/70 shadow-cyan-500/20 hover:shadow-cyan-500/40",
    },
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl border backdrop-blur-sm transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        colorClasses[glowColor][intensity],
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
