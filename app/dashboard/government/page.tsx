"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Brain,
  Wallet,
  Activity,
  ArrowUpRight,
  Settings,
  FileText,
  BarChart3,
  Zap,
  Globe,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { GlowCard } from "@/components/ui/glow-card"
import { GlowButton } from "@/components/ui/glow-button"
import { Badge } from "@/components/ui/badge"
import { blockfrostClient } from "@/lib/blockfrost/client"
import Link from "next/link"

export default function GovernmentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [blockchainData, setBlockchainData] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || user.user_metadata?.role !== "government") {
        router.push("/auth")
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()

    // Fetch blockchain data
    const fetchBlockchainData = async () => {
      try {
        const latestBlock = await blockfrostClient.getLatestBlock()
        setBlockchainData({ latestBlock })
      } catch (error) {
        console.error("Failed to fetch blockchain data:", error)
      }
    }
    fetchBlockchainData()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="h-8 w-8 text-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white">
      <DashboardHeader user={user} />

      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Government Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-75" />
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Government Command Center
                </h1>
                <p className="text-gray-400 text-base lg:text-lg mt-2">Strategic oversight and policy coordination</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1.5 text-sm">
                <Activity className="h-4 w-4 mr-2" />
                System Ready
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1.5 text-sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Ready
              </Badge>
              {blockchainData && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-3 py-1.5 text-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Block #{blockchainData.latestBlock.height}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Government Focused */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/simulation/builder">
            <GlowCard
              glowColor="blue"
              intensity="medium"
              className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                  <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Create Simulation</h3>
                  <p className="text-gray-400 text-xs">New scenario</p>
                </div>
              </div>
            </GlowCard>
          </Link>

          <GlowCard
            glowColor="green"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Policy Templates</h3>
                <p className="text-gray-400 text-xs">Pre-built frameworks</p>
              </div>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="purple"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Funding Tracker</h3>
                <p className="text-gray-400 text-xs">Transparent flows</p>
              </div>
            </div>
          </GlowCard>

          <Link href="/settings">
            <GlowCard
              glowColor="cyan"
              intensity="medium"
              className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                  <div className="relative p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Integration Setup</h3>
                  <p className="text-gray-400 text-xs">AI & Blockchain</p>
                </div>
              </div>
            </GlowCard>
          </Link>
        </div>

        {/* Government-Specific Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Outbreak Metrics - Priority for Government */}
          <div className="lg:col-span-2">
            <GlowCard glowColor="blue" intensity="medium" className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur" />
                    <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Outbreak Trend Analysis</h3>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  High Priority
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-blue-400">2,847</div>
                    <div className="text-gray-400 text-sm">Active Cases</div>
                    <div className="text-green-400 text-xs">↓ 12% from last week</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-green-400">94.2%</div>
                    <div className="text-gray-400 text-sm">Recovery Rate</div>
                    <div className="text-green-400 text-xs">↑ 2.1% improvement</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-purple-400">15</div>
                    <div className="text-gray-400 text-sm">Regions Affected</div>
                    <div className="text-yellow-400 text-xs">→ Stable</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-cyan-400">72h</div>
                    <div className="text-gray-400 text-sm">Response Time</div>
                    <div className="text-green-400 text-xs">↓ 18h faster</div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Regional Distribution</h4>
                    <span className="text-gray-400 text-sm">Last updated: 2 hours ago</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Lagos State</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-4/5"></div>
                        </div>
                        <span className="text-red-400 text-sm">847</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Kano State</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 w-3/5"></div>
                        </div>
                        <span className="text-orange-400 text-sm">623</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Rivers State</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-500 to-green-500 w-2/5"></div>
                        </div>
                        <span className="text-yellow-400 text-sm">412</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Policy Advisor - AI Integration */}
          <GlowCard glowColor="purple" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Policy Advisor</h3>
                <p className="text-gray-400 text-sm">Government Agent</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Active Recommendation</span>
                </div>
                <p className="text-white text-sm mb-3">
                  "Based on current trends, recommend implementing targeted lockdown in Lagos State high-density areas
                  while maintaining economic corridors."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-xs">Confidence: 94%</span>
                  <GlowButton size="sm" glowColor="purple" variant="outline">
                    View Details
                  </GlowButton>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Recent Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Resource allocation optimization completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Cross-border coordination protocols updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Policy impact simulation ready</span>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="purple" size="sm" className="w-full">
                Configure AI Settings
                <Settings className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>

        {/* Funding Transparency & Blockchain Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="green" intensity="medium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-lg blur" />
                  <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Funding Transparency</h3>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Zap className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-xl font-bold text-green-400">₳2.4M</div>
                  <div className="text-gray-400 text-sm">Total Allocated</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-xl font-bold text-blue-400">₳1.8M</div>
                  <div className="text-gray-400 text-sm">Distributed</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Recent Transactions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Emergency Response Fund</span>
                    </div>
                    <span className="text-green-400 text-sm">₳450K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Medical Supply Chain</span>
                    </div>
                    <span className="text-blue-400 text-sm">₳320K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Research & Development</span>
                    </div>
                    <span className="text-purple-400 text-sm">₳180K</span>
                  </div>
                </div>
              </div>

              {blockchainData && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 text-sm">Latest Block</span>
                    <span className="text-white font-mono text-sm">#{blockchainData.latestBlock.height}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-cyan-400 text-sm">Transactions</span>
                    <span className="text-white font-mono text-sm">{blockchainData.latestBlock.tx_count}</span>
                  </div>
                </div>
              )}
            </div>
          </GlowCard>

          <GlowCard glowColor="cyan" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Multi-Stakeholder Coordination</h3>
                <p className="text-gray-400 text-sm">Connected Partners</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-green-400">12</div>
                  <div className="text-gray-400 text-xs">NGOs</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-red-400">8</div>
                  <div className="text-gray-400 text-xs">Hospitals</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-purple-400">5</div>
                  <div className="text-gray-400 text-xs">Research</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Active Collaborations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">WHO Nigeria Office</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Red Cross Nigeria</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">NCDC</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Monitoring</Badge>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="cyan" size="sm" className="w-full">
                Manage Partnerships
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
