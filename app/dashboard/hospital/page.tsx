"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  Users,
  Bed,
  Activity,
  AlertTriangle,
  Stethoscope,
  Brain,
  ArrowUpRight,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { GlowCard } from "@/components/ui/glow-card"
import { GlowButton } from "@/components/ui/glow-button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HospitalDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || user.user_metadata?.role !== "hospital") {
        router.push("/auth")
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-pink-950 text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="h-8 w-8 text-red-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-pink-950 text-white">
      <DashboardHeader user={user} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-75" />
                <div className="relative p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl">
                  <Heart className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Hospital Command Center
                </h1>
                <p className="text-gray-400 text-base lg:text-lg mt-2">
                  Patient care coordination and resource management
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1.5 text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Systems Online
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1.5 text-sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Triage Ready
              </Badge>
            </div>
          </div>
        </div>

        {/* Hospital-Specific Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlowCard
            glowColor="red"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <Bed className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Capacity Planning</h3>
                <p className="text-gray-400 text-xs">Bed allocation</p>
              </div>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="blue"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Patient Flow</h3>
                <p className="text-gray-400 text-xs">AI-powered triage</p>
              </div>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="green"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Resource Management</h3>
                <p className="text-gray-400 text-xs">Supplies & equipment</p>
              </div>
            </div>
          </GlowCard>

          <Link href="/settings">
            <GlowCard
              glowColor="purple"
              intensity="medium"
              className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                  <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">System Configuration</h3>
                  <p className="text-gray-400 text-xs">AI & protocols</p>
                </div>
              </div>
            </GlowCard>
          </Link>
        </div>

        {/* Hospital-Focused Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hospital Resource Charts - Priority for Hospital */}
          <div className="lg:col-span-2">
            <GlowCard glowColor="red" intensity="medium" className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/30 rounded-lg blur" />
                    <div className="relative p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                      <Bed className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">ICU & Bed Utilization</h3>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Near Capacity
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-red-400">89%</div>
                    <div className="text-gray-400 text-sm">ICU Occupancy</div>
                    <div className="text-red-400 text-xs">↑ 12% from yesterday</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-orange-400">76%</div>
                    <div className="text-gray-400 text-sm">General Beds</div>
                    <div className="text-orange-400 text-xs">↑ 8% increase</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-green-400">24</div>
                    <div className="text-gray-400 text-sm">Available Beds</div>
                    <div className="text-yellow-400 text-xs">Critical level</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-blue-400">156</div>
                    <div className="text-gray-400 text-sm">Staff on Duty</div>
                    <div className="text-green-400 text-xs">Fully staffed</div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Department Utilization</h4>
                    <span className="text-gray-400 text-sm">Real-time data</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Emergency Department</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-11/12"></div>
                        </div>
                        <span className="text-red-400 text-sm">94%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Intensive Care Unit</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-5/6"></div>
                        </div>
                        <span className="text-orange-400 text-sm">89%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Medical Ward</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-3/4"></div>
                        </div>
                        <span className="text-yellow-400 text-sm">76%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Surgical Ward</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 w-3/5"></div>
                        </div>
                        <span className="text-green-400 text-sm">62%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Capacity Alert</span>
                  </div>
                  <p className="text-white text-sm">
                    ICU approaching maximum capacity. Consider activating overflow protocols and coordinating with
                    partner hospitals.
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* AI Triage System */}
          <GlowCard glowColor="blue" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Triage System</h3>
                <p className="text-gray-400 text-sm">Intelligent Patient Routing</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">System Active</span>
                </div>
                <p className="text-white text-sm mb-3">
                  "Current patient flow suggests redirecting non-critical cases to Medical Ward. ICU reserved for
                  priority cases only."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 text-xs">Efficiency: 96%</span>
                  <GlowButton size="sm" glowColor="blue" variant="outline">
                    View Queue
                  </GlowButton>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Triage Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Average Wait Time</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-blue-400 text-sm">18 min</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Priority Accuracy</span>
                    <span className="text-green-400 text-sm">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Patients Processed</span>
                    <span className="text-purple-400 text-sm">247 today</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Current Queue</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Critical: 3 patients</span>
                    </div>
                    <span className="text-red-400 text-sm">Immediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Urgent: 8 patients</span>
                    </div>
                    <span className="text-orange-400 text-sm">Less than 30 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Standard: 15 patients</span>
                    </div>
                    <span className="text-yellow-400 text-sm">Less than 2 hours</span>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="blue" size="sm" className="w-full">
                Configure Triage AI
                <Settings className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>

        {/* Resource Management & Emergency Protocols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="green" intensity="medium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-lg blur" />
                  <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Medical Resources</h3>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Well Stocked
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-xl font-bold text-green-400">847</div>
                  <div className="text-gray-400 text-sm">Ventilators</div>
                  <div className="text-green-400 text-xs">23 available</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-xl font-bold text-blue-400">2.4K</div>
                  <div className="text-gray-400 text-sm">PPE Units</div>
                  <div className="text-blue-400 text-xs">3 days supply</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Critical Supplies</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Oxygen Supply</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-5/6"></div>
                      </div>
                      <span className="text-green-400 text-sm">87%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Blood Bank</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 w-3/5"></div>
                      </div>
                      <span className="text-red-400 text-sm">62%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Medications</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-4/5"></div>
                      </div>
                      <span className="text-blue-400 text-sm">78%</span>
                    </div>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="green" size="sm" className="w-full">
                Request Supplies
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>

          <GlowCard glowColor="purple" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Emergency Protocols</h3>
                <p className="text-gray-400 text-sm">Automated Response Systems</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-400 text-sm font-medium">Protocol Status</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Ready</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Capacity Overflow</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Staff Augmentation</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Supply Emergency</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Standby</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Partner Hospitals</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Lagos University Hospital</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">National Hospital Abuja</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Limited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Federal Medical Centre</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Available</Badge>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="purple" size="sm" className="w-full">
                Configure Protocols
                <Settings className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
