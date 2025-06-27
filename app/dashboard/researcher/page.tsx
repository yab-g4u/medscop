"use client"

import { useState, useEffect } from "react"
import {
  Brain,
  BarChart3,
  FileText,
  Database,
  TrendingUp,
  Settings,
  ArrowUpRight,
  Activity,
  Globe,
  Download,
  Upload,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { GlowCard } from "@/components/ui/glow-card"
import { GlowButton } from "@/components/ui/glow-button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ResearcherDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || user.user_metadata?.role !== "researcher") {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 text-white">
      <DashboardHeader user={user} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Researcher Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-75" />
                <div className="relative p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl">
                  <Brain className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Research Laboratory
                </h1>
                <p className="text-gray-400 text-base lg:text-lg mt-2">Epidemic modeling and data analysis platform</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1.5 text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Analysis Ready
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1.5 text-sm">
                <Database className="h-4 w-4 mr-2" />
                Data Connected
              </Badge>
            </div>
          </div>
        </div>

        {/* Research-Specific Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/simulation/builder">
            <GlowCard
              glowColor="purple"
              intensity="medium"
              className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                  <div className="relative p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Model Builder</h3>
                  <p className="text-gray-400 text-xs">Custom models</p>
                </div>
              </div>
            </GlowCard>
          </Link>

          <GlowCard
            glowColor="blue"
            intensity="medium"
            className="p-4 group cursor-pointer hover:scale-105 transition-all duration-300 h-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Data Analysis</h3>
                <p className="text-gray-400 text-xs">Statistical tools</p>
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
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Research Papers</h3>
                <p className="text-gray-400 text-xs">Publication ready</p>
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
                  <h3 className="text-white font-semibold text-sm">Data Sources</h3>
                  <p className="text-gray-400 text-xs">Configure APIs</p>
                </div>
              </div>
            </GlowCard>
          </Link>
        </div>

        {/* Research-Focused Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Infection/Mortality Curves + Raw Data - Priority for Researchers */}
          <div className="lg:col-span-2">
            <GlowCard glowColor="purple" intensity="medium" className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur" />
                    <div className="relative p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Epidemiological Data Analysis</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Database className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                  <GlowButton size="sm" glowColor="purple" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Export CSV
                  </GlowButton>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-red-400">2.847</div>
                    <div className="text-gray-400 text-sm">R₀ Value</div>
                    <div className="text-red-400 text-xs">↑ 0.12 increase</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-orange-400">14.2</div>
                    <div className="text-gray-400 text-sm">Doubling Time</div>
                    <div className="text-orange-400 text-xs">Days</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-blue-400">0.94</div>
                    <div className="text-gray-400 text-sm">Model Accuracy</div>
                    <div className="text-green-400 text-xs">↑ 2% improvement</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-2xl font-bold text-purple-400">847K</div>
                    <div className="text-gray-400 text-sm">Data Points</div>
                    <div className="text-purple-400 text-xs">Last 30 days</div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Model Parameters</h4>
                    <GlowButton size="sm" glowColor="blue" variant="outline">
                      Fine-tune
                    </GlowButton>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Incubation Period</span>
                        <span className="text-blue-400 text-sm">5.2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Infectious Period</span>
                        <span className="text-green-400 text-sm">7.8 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Case Fatality Rate</span>
                        <span className="text-red-400 text-sm">2.4%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Attack Rate</span>
                        <span className="text-purple-400 text-sm">18.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Herd Immunity</span>
                        <span className="text-cyan-400 text-sm">65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Vaccine Efficacy</span>
                        <span className="text-green-400 text-sm">89.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Raw Data Table</h4>
                    <div className="flex items-center space-x-2">
                      <GlowButton size="sm" glowColor="green" variant="outline">
                        <Upload className="h-3 w-3 mr-1" />
                        Import
                      </GlowButton>
                      <GlowButton size="sm" glowColor="blue" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </GlowButton>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left text-gray-400 py-2">Date</th>
                          <th className="text-left text-gray-400 py-2">Cases</th>
                          <th className="text-left text-gray-400 py-2">Deaths</th>
                          <th className="text-left text-gray-400 py-2">Recovered</th>
                          <th className="text-left text-gray-400 py-2">R₀</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800/50">
                          <td className="text-gray-300 py-2">2024-01-15</td>
                          <td className="text-blue-400 py-2">2,847</td>
                          <td className="text-red-400 py-2">68</td>
                          <td className="text-green-400 py-2">2,681</td>
                          <td className="text-purple-400 py-2">2.84</td>
                        </tr>
                        <tr className="border-b border-gray-800/50">
                          <td className="text-gray-300 py-2">2024-01-14</td>
                          <td className="text-blue-400 py-2">2,623</td>
                          <td className="text-red-400 py-2">63</td>
                          <td className="text-green-400 py-2">2,467</td>
                          <td className="text-purple-400 py-2">2.91</td>
                        </tr>
                        <tr className="border-b border-gray-800/50">
                          <td className="text-gray-300 py-2">2024-01-13</td>
                          <td className="text-blue-400 py-2">2,412</td>
                          <td className="text-red-400 py-2">59</td>
                          <td className="text-green-400 py-2">2,298</td>
                          <td className="text-purple-400 py-2">3.02</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Data Insight Agent */}
          <GlowCard glowColor="blue" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Data Insight Agent</h3>
                <p className="text-gray-400 text-sm">AI Research Assistant</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Analysis Complete</span>
                </div>
                <p className="text-white text-sm mb-3">
                  "Correlation analysis reveals strong relationship between population density and transmission rate
                  (r=0.87). Recommend stratified modeling approach."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 text-xs">Statistical Significance: p&lt;0.001</span>
                  <GlowButton size="sm" glowColor="blue" variant="outline">
                    View Analysis
                  </GlowButton>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Research Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Seasonal pattern detected in transmission</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Intervention effectiveness quantified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Predictive model accuracy improved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Publication-ready visualizations generated</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Data Sources</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">WHO Global Database</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">NCDC Nigeria</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Local Surveillance</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Pending</Badge>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="blue" size="sm" className="w-full">
                Configure Data Sources
                <Settings className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>

        {/* Research Workflow & Collaboration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="green" intensity="medium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-lg blur" />
                  <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Research Publications</h3>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />3 Ready
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Draft Papers</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-300 text-sm font-medium">Epidemic Modeling in West Africa</div>
                      <div className="text-gray-500 text-xs">Mathematical Biology Journal</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-300 text-sm font-medium">AI-Driven Policy Optimization</div>
                      <div className="text-gray-500 text-xs">Nature Medicine</div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Review</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-300 text-sm font-medium">Blockchain in Public Health</div>
                      <div className="text-gray-500 text-xs">PLOS ONE</div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Draft</Badge>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="green" size="sm" className="w-full">
                Generate Report
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>

          <GlowCard glowColor="cyan" intensity="medium" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur" />
                <div className="relative p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <Globe className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Global Collaboration</h3>
                <p className="text-gray-400 text-sm">Research Network</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-blue-400">23</div>
                  <div className="text-gray-400 text-xs">Institutions</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-green-400">47</div>
                  <div className="text-gray-400 text-xs">Researchers</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                  <div className="text-lg font-bold text-purple-400">12</div>
                  <div className="text-gray-400 text-xs">Countries</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3">Active Collaborations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Imperial College London</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Johns Hopkins University</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Data Sharing</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">University of Cape Town</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Joint Study</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">WHO Collaborating Centre</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Advisory</Badge>
                  </div>
                </div>
              </div>

              <GlowButton glowColor="cyan" size="sm" className="w-full">
                Manage Network
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </GlowButton>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
