"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "destructive":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getBorderColor = () => {
    switch (variant) {
      case "success":
        return "border-green-500/30"
      case "destructive":
        return "border-red-500/30"
      default:
        return "border-blue-500/30"
    }
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 bg-gray-800/95 backdrop-blur-sm border ${getBorderColor()} rounded-lg p-4 min-w-[300px] max-w-[400px] shadow-lg`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">{title}</h4>
          {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  React.useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { title, description, variant } = event.detail
      const id = Math.random().toString(36).substr(2, 9)

      setToasts((prev) => [...prev, { id, title, description, variant, onClose: () => removeToast(id) }])
    }

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    window.addEventListener("toast" as any, handleToast)
    return () => window.removeEventListener("toast" as any, handleToast)
  }, [])

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
