"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  Package,
  MapPin,
  Truck,
  Brain,
  Wallet,
  Activity,
  ArrowUpRight,
  Settings,
  Users,
  TrendingUp,
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

export default function NGODashboard() {
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
      if (!user || user.user_metadata?.role !== "ngo") {
        router.push("/auth")
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()

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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-emerald-950 text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="h-8 w-8 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-emerald-950 text-white">
      <DashboardHeader user={user} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NGO Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-75" />
                <div className="relative p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <Heart className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  NGO Operations Center
                </h1>
                <p className="text-gray-400 text-base lg:text-lg mt-2">
                  Humanitarian aid coordination and resource distribution
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1.5 text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Operations Active
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1.5 text-sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Logistics Ready
              </Badge>
            </div>
          </div>
        </div>

        {/* NGO-Specific Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlowCard
            glowColor="green"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Plan Distribution</h3>
                <p className="text-gray-400 text-xs">Supply strategies</p>
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
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Track Resources</h3>
                <p className="text-gray-400 text-xs">Supply chain</p>
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
                <h3 className="text-white font-semibold text-sm">Funding Dashboard</h3>
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
                  <h3 className="text-white font-semibold text-sm">Configure Systems</h3>
                  <p className="text-gray-400 text-xs">AI & Blockchain</p>
                </div>
              </div>
            </GlowCard>
          </Link>
        </div>

        {/* NGO-Focused Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Funding Flows - Priority for NGO */}
          <div className="lg:col-span-2">
            <GlowCard glowColor="green" intensity="medium" className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/30 rounded-lg blur" />
                    <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">ADA Wallet & Funding Flows</h3>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Tracking
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-green-400">₳847K</div>
                    <div className="text-gray-400 text-sm">Available Funds</div>
                    <div className="text-green-400 text-xs">↑ ₳120K received</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-blue-400">₳623K</div>
                    <div className="text-gray-400 text-sm">Distributed</div>
                    <div className="text-blue-400 text-xs">73.5% of total</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-purple-400">₳224K</div>
                    <div className="text-gray-400 text-sm">Pending</div>
                    <div className="text-yellow-400 text-xs">3 transactions</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-cyan-400">94.2%</div>
                    <div className="text-gray-400 text-sm">Transparency</div>
                    <div className="text-green-400 text-xs">Blockchain verified</div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Recent Fund Releases</h4>
                    <span className="text-gray-400 text-sm">Last 24 hours</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <span className="text-gray-300 text-sm">Emergency Medical Supplies</span>
                          <div className="text-gray-500 text-xs">Lagos Distribution Center</div>
                        </div>
                      </div>
                      <span className="text-green-400 text-sm font-mono">₳180K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div>
                          <span className="text-gray-300 text-sm">Food Aid Package</span>
                          <div className="text-gray-500 text-xs">Kano Relief Operations</div>
                        </div>
                      </div>
                      <span className="text-blue-400 text-sm font-mono">₳95K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div>
                          <span className="text-gray-300 text-sm">Community Health Workers</span>
                          <div className="text-gray-500 text-xs">Rivers State Program</div>
                        </div>
                      </div>
                      <span className="text-purple-400 text-sm font-mono">₳67K</span>
                    </div>
                  </div>
                </div>

                {blockchainData && (
                  <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 text-sm font-medium">Cardano Network Status</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Online</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Latest Block:</span>
                        <span className="text-white font-mono">#{blockchainData.latestBlock.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transactions:</span>
                        <span className="text-white font-mono">{blockchainData.latestBlock.tx_count}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlowCard>
          </div>

          {/* Community Sentiment Monitor - AI Integration */}
          <GlowCard glowColor="purple" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sentiment Monitor</h3>
                <p className="text-gray-400 text-sm">AI Community Analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Positive Trend</span>
                </div>
                <p className="text-white text-sm mb-3">
                  "Community response to food distribution in Lagos shows 87% satisfaction rate. Recommend expanding
                  program to neighboring areas."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-xs">Confidence: 91%</span>
                  <GlowButton size="sm" glowColor="purple" variant="outline">
                    View Report
                  </GlowButton>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Community Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Aid Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-5/6"></div>
                      </div>
                      <span className="text-green-400 text-sm">87%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Distribution Efficiency</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-4/5"></div>
                      </div>
                      <span className="text-blue-400 text-sm">82%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Community Trust</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-11/12"></div>
                      </div>
                      <span className="text-purple-400 text-sm">94%</span>
                    </div>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="purple" size="sm" className="w-full">
                Configure AI Monitoring
                <Settings className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>

        {/* Supply Chain & Logistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="blue" intensity="medium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur" />
                  <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Supply Chain Optimization</h3>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Optimizing
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-xl font-bold text-blue-400">12</div>
                  <div className="text-gray-400 text-sm">Distribution Hubs</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-xl font-bold text-green-400">847</div>
                  <div className="text-gray-400 text-sm">Active Routes</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Active Deliveries</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">Medical Supplies → Lagos</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">En Route</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">Food Aid → Kano</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Loading</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">Emergency Kit → Rivers</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Delayed</Badge>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="blue" size="sm" className="w-full">
                Optimize Routes
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </GlowButton>
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
                <h3 className="text-xl font-bold text-white">Partner Network</h3>
                <p className="text-gray-400 text-sm">Connected Organizations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-blue-400">8</div>
                  <div className="text-gray-400 text-xs">Government</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-red-400">15</div>
                  <div className="text-gray-400 text-xs">Hospitals</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-purple-400">23</div>
                  <div className="text-gray-400 text-xs">NGOs</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Active Partnerships</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">UNICEF Nigeria</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Doctors Without Borders</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">World Food Programme</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Coordinating</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Local Health Ministry</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Planning</Badge>
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
