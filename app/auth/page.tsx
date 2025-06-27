"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { GlowCard } from "@/components/ui/glow-card"
import { GlowButton } from "@/components/ui/glow-button"
import { Badge } from "@/components/ui/badge"
import { Activity, Shield, Heart, Stethoscope, Brain, Mail, Lock, User, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()
  const router = useRouter()

  const roles = [
    {
      id: "government",
      label: "Government Health Official",
      icon: Shield,
      color: "blue",
      description: "High-level outbreak metrics, funding transparency, policy decisions",
    },
    {
      id: "hospital",
      label: "Field Health Specialist",
      icon: Stethoscope,
      color: "red",
      description: "Resource allocation, hospital occupancy, logistics management",
    },
    {
      id: "ngo",
      label: "NGO Coordinator",
      icon: Heart,
      color: "green",
      description: "Funding flows, community interventions, public sentiment trends",
    },
    {
      id: "researcher",
      label: "Epidemiologist / Researcher",
      icon: Brain,
      color: "purple",
      description: "Raw data, scenario modeling, downloadable reports",
    },
  ]

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        if (!selectedRole) {
          setError("Please select a role")
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              role: selectedRole,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          router.push(`/dashboard/${selectedRole}`)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          const userRole = data.user.user_metadata?.role
          if (userRole) {
            router.push(`/dashboard/${userRole}`)
          } else {
            router.push("/dashboard")
          }
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75" />
                <div className="relative p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                MEDSCOPE
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {isSignUp ? "Join the Network" : "Welcome Back"}
            </h1>
            <p className="text-lg text-gray-400">
              {isSignUp
                ? "Create your account and select your role in the epidemic response network"
                : "Sign in to access your personalized dashboard"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Auth Form */}
            <GlowCard glowColor="cyan" intensity="medium" className="p-8">
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? "Create Account" : "Sign In"}</h2>
                  <p className="text-gray-400 text-sm">
                    {isSignUp ? "Fill in your details to get started" : "Enter your credentials to continue"}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <GlowButton type="submit" glowColor="cyan" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </GlowButton>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError("")
                      setSelectedRole("")
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </GlowCard>

            {/* Role Selection */}
            {isSignUp && (
              <GlowCard glowColor="purple" intensity="medium" className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Select Your Role</h3>
                  <p className="text-gray-400 text-sm">
                    Choose the role that best describes your position in the epidemic response network
                  </p>
                </div>

                <div className="space-y-4">
                  {roles.map((role) => {
                    const IconComponent = role.icon
                    const isSelected = selectedRole === role.id

                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? `border-${role.color}-500/50 bg-${role.color}-500/10`
                            : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${isSelected ? `bg-${role.color}-500/20` : "bg-gray-700/50"}`}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${isSelected ? `text-${role.color}-400` : "text-gray-400"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`font-semibold ${isSelected ? "text-white" : "text-gray-300"}`}>
                                {role.label}
                              </h4>
                              {isSelected && (
                                <Badge
                                  className={`bg-${role.color}-500/20 text-${role.color}-400 border-${role.color}-500/30 text-xs`}
                                >
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{role.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {selectedRole && (
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">
                      ✓ Role selected! You'll be redirected to your personalized dashboard after account creation.
                    </p>
                  </div>
                )}
              </GlowCard>
            )}

            {/* Sign In Info */}
            {!isSignUp && (
              <GlowCard glowColor="blue" intensity="medium" className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Role-Based Dashboards</h3>
                  <p className="text-gray-400 mb-6">
                    Each role has a tailored dashboard with relevant metrics, controls, and AI insights
                  </p>

                  <div className="space-y-4">
                    {roles.map((role) => {
                      const IconComponent = role.icon
                      return (
                        <div
                          key={role.id}
                          className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
                        >
                          <div className={`p-2 bg-${role.color}-500/20 rounded-lg`}>
                            <IconComponent className={`h-4 w-4 text-${role.color}-400`} />
                          </div>
                          <div className="text-left">
                            <div className="text-white font-medium text-sm">{role.label}</div>
                            <div className="text-gray-400 text-xs">{role.description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </GlowCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
