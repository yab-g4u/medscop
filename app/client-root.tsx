"use client"

import type React from "react"

import { useEffect } from "react"

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode
}) {
  /* ---------- Self-healing for “Loading chunk … failed” ---------- */
  useEffect(() => {
    function retryOnChunkError(event: ErrorEvent | PromiseRejectionEvent) {
      const message = (event as any)?.message || (event as any)?.reason?.message
      if (/Loading chunk [\d]+ failed/.test(message)) {
        const retries = Number(sessionStorage.getItem("chunk-retries") || "0")
        if (retries < 1) {
          sessionStorage.setItem("chunk-retries", String(retries + 1))
          window.location.reload()
        } else {
          sessionStorage.removeItem("chunk-retries")
        }
      }
    }

    window.addEventListener("error", retryOnChunkError)
    window.addEventListener("unhandledrejection", retryOnChunkError)
    return () => {
      window.removeEventListener("error", retryOnChunkError)
      window.removeEventListener("unhandledrejection", retryOnChunkError)
    }
  }, [])
  /* ---------------------------------------------------------------- */

  return <>{children}</>
}
