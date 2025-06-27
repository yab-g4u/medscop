"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Activity, Download, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts"

// Mock analytics data
const simulationHistory = [
  { name: "Ebola West Africa", status: "Completed", cases: 28616, deaths: 11310, duration: 180, funding: 2400000 },
  { name: "COVID-19 Nigeria", status: "Running", cases: 12847, deaths: 280, duration: 42, funding: 500000 },
  { name: "Cholera Kenya", status: "Completed", cases: 4521, deaths: 89, duration: 90, funding: 750000 },
  { name: "Malaria Ghana", status: "Completed", cases: 15632, deaths: 234, duration: 120, funding: 1200000 },
]

const monthlyData = [
  { month: "Jan", simulations: 12, cases: 45000, funding: 2100000 },
  { month: "Feb", simulations: 15, cases: 52000, funding: 2800000 },
  { month: "Mar", simulations: 18, cases: 38000, funding: 3200000 },
  { month: "Apr", simulations: 22, cases: 61000, funding: 4100000 },
  { month: "May", simulations: 19, cases: 47000, funding: 3600000 },
  { month: "Jun", simulations: 25, cases: 73000, funding: 4800000 },
]

const diseaseDistribution = [
  { name: "COVID-19", value: 35, color: "#EF4444" },
  { name: "Ebola", value: 25, color: "#F59E0B" },
  { name: "Malaria", value: 20, color: "#10B981" },
  { name: "Cholera", value: 12, color: "#3B82F6" },
  { name: "Other", value: 8, color: "#8B5CF6" },
]

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <DashboardHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Analytics & Insights</h1>
              <p className="text-gray-400">Comprehensive analysis of simulation outcomes and trends</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Simulations</p>
                  <p className="text-2xl font-bold text-white">127</p>
                  <p className="text-xs text-green-400">+12% this month</p>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Cases Simulated</p>
                  <p className="text-2xl font-bold text-white">2.4M</p>
                  <p className="text-xs text-green-400">+8% this month</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Funding Tracked</p>
                  <p className="text-2xl font-bold text-white">₳ 24.8M</p>
                  <p className="text-xs text-green-400">+15% this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">AI Decisions</p>
                  <p className="text-2xl font-bold text-white">8,947</p>
                  <p className="text-xs text-green-400">+22% this month</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="simulations" className="data-[state=active]:bg-gray-700">
              Simulations
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="data-[state=active]:bg-gray-700">
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="data-[state=active]:bg-gray-700">
              Blockchain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Simulation Trends</CardTitle>
                  <CardDescription className="text-gray-400">Simulations, cases, and funding over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="simulations" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Disease Distribution */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Disease Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Most simulated diseases by percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {diseaseDistribution.map((disease, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: disease.color }}></div>
                          <span className="text-white">{disease.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${disease.value}%`,
                                backgroundColor: disease.color,
                              }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-sm w-8">{disease.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Impact */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Regional Impact Analysis</CardTitle>
                <CardDescription className="text-gray-400">Simulation outcomes across African regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">West Africa</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-red-400">847K</div>
                      <p className="text-gray-400 text-sm">Total Cases Simulated</p>
                      <div className="text-lg font-semibold text-white">₳ 8.2M</div>
                      <p className="text-gray-400 text-sm">Funding Tracked</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">East Africa</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-red-400">623K</div>
                      <p className="text-gray-400 text-sm">Total Cases Simulated</p>
                      <div className="text-lg font-semibold text-white">₳ 6.4M</div>
                      <p className="text-gray-400 text-sm">Funding Tracked</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Central Africa</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-red-400">394K</div>
                      <p className="text-gray-400 text-sm">Total Cases Simulated</p>
                      <div className="text-lg font-semibold text-white">₳ 4.8M</div>
                      <p className="text-gray-400 text-sm">Funding Tracked</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulations" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Simulation History</CardTitle>
                <CardDescription className="text-gray-400">
                  Complete record of all simulations and their outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Simulation</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Cases</th>
                        <th className="text-left py-3 px-4 text-gray-400">Deaths</th>
                        <th className="text-left py-3 px-4 text-gray-400">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-400">Funding</th>
                        <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationHistory.map((sim, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-3 px-4 text-white font-medium">{sim.name}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                sim.status === "Completed"
                                  ? "bg-green-900/20 text-green-300"
                                  : "bg-yellow-900/20 text-yellow-300"
                              }`}
                            >
                              {sim.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">{sim.cases.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-400">{sim.deaths.toLocaleString()}</td>
                          <td className="py-3 px-4 text-white">{sim.duration} days</td>
                          <td className="py-3 px-4 text-white">₳ {(sim.funding / 1000000).toFixed(1)}M</td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Agent Performance</CardTitle>
                  <CardDescription className="text-gray-400">Success rates and decision accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Policy Advisor</p>
                        <p className="text-gray-400 text-sm">Strategic recommendations</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">94%</p>
                        <p className="text-gray-400 text-sm">Success rate</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Logistics Coordinator</p>
                        <p className="text-gray-400 text-sm">Resource optimization</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">87%</p>
                        <p className="text-gray-400 text-sm">Efficiency rate</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Government Delay</p>
                        <p className="text-gray-400 text-sm">Bureaucratic modeling</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold">72%</p>
                        <p className="text-gray-400 text-sm">Accuracy rate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Decision Impact</CardTitle>
                  <CardDescription className="text-gray-400">
                    How AI decisions affected simulation outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">23%</div>
                      <p className="text-gray-400 text-sm">Average case reduction</p>
                      <p className="text-gray-500 text-xs">Through AI recommendations</p>
                    </div>

                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-1">31%</div>
                      <p className="text-gray-400 text-sm">Resource efficiency gain</p>
                      <p className="text-gray-500 text-xs">Logistics optimization</p>
                    </div>

                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">2.3x</div>
                      <p className="text-gray-400 text-sm">Delay factor</p>
                      <p className="text-gray-500 text-xs">Government processes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Funding Transparency</CardTitle>
                  <CardDescription className="text-gray-400">Blockchain verification statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-3xl font-bold text-green-400 mb-2">99.7%</div>
                      <p className="text-gray-400">Transaction Success Rate</p>
                      <p className="text-gray-500 text-sm">8,947 of 8,974 transactions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-700 rounded-lg">
                        <div className="text-xl font-bold text-blue-400 mb-1">₳ 24.8M</div>
                        <p className="text-gray-400 text-sm">Total Tracked</p>
                      </div>

                      <div className="text-center p-3 bg-gray-700 rounded-lg">
                        <div className="text-xl font-bold text-purple-400 mb-1">1,247</div>
                        <p className="text-gray-400 text-sm">Agent Wallets</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Delays Impact</CardTitle>
                  <CardDescription className="text-gray-400">How funding delays affected outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">No Delays</p>
                        <p className="text-gray-400 text-sm">Immediate funding</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">15%</p>
                        <p className="text-gray-400 text-sm">Better outcomes</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Minimal Delays</p>
                        <p className="text-gray-400 text-sm">1-3 day delays</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold">8%</p>
                        <p className="text-gray-400 text-sm">Impact on outcomes</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Severe Delays</p>
                        <p className="text-gray-400 text-sm">1+ month delays</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-bold">34%</p>
                        <p className="text-gray-400 text-sm">Worse outcomes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
