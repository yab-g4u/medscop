"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlowButtonProps {
  children: ReactNode
  className?: string
  glowColor?: "blue" | "green" | "purple" | "red" | "cyan"
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
}

export function GlowButton({
  children,
  className,
  glowColor = "blue",
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
}: GlowButtonProps) {
  const colorClasses = {
    blue: {
      primary:
        "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 shadow-blue-500/50 hover:shadow-blue-500/70",
      secondary: "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 text-blue-300 hover:text-blue-200",
      outline: "border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400",
    },
    green: {
      primary:
        "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-green-500/50 hover:shadow-green-500/70",
      secondary: "bg-green-500/20 hover:bg-green-500/30 border-green-500/50 text-green-300 hover:text-green-200",
      outline: "border-green-500/50 text-green-300 hover:bg-green-500/20 hover:border-green-400",
    },
    purple: {
      primary:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/50 hover:shadow-purple-500/70",
      secondary: "bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-300 hover:text-purple-200",
      outline: "border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400",
    },
    red: {
      primary:
        "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 shadow-red-500/50 hover:shadow-red-500/70",
      secondary: "bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-300 hover:text-red-200",
      outline: "border-red-500/50 text-red-300 hover:bg-red-500/20 hover:border-red-400",
    },
    cyan: {
      primary:
        "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/50 hover:shadow-cyan-500/70",
      secondary: "bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 text-cyan-300 hover:text-cyan-200",
      outline: "border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400",
    },
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
        "shadow-lg hover:shadow-xl",
        colorClasses[glowColor][variant],
        sizeClasses[size],
        variant === "outline" && "border-2 bg-transparent",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10">{children}</span>
    </Button>
  )
}
