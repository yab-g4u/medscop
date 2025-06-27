"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      const userRole = user.user_metadata?.role

      switch (userRole) {
        case "government":
          router.push("/dashboard/government")
          break
        case "ngo":
          router.push("/dashboard/ngo")
          break
        case "hospital":
          router.push("/dashboard/hospital")
          break
        case "researcher":
          router.push("/dashboard/researcher")
          break
        case "admin":
          router.push("/admin")
          break
        default:
          // If no role is set, redirect to auth for role selection
          router.push("/auth")
          break
      }
      setLoading(false)
    }

    redirectBasedOnRole()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-cyan-400 font-semibold">Redirecting...</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
