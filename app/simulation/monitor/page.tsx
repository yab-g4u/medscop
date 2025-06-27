"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  Square,
  Download,
  ArrowLeft,
  Users,
  TrendingUp,
  AlertTriangle,
  Brain,
  Shield,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { queryGeminiAgent } from "@/lib/gemini/client"
import { toast } from "@/hooks/use-toast"
import { GlowCard } from "@/components/ui/glow-card"
import EpidemicMap from "@/components/epidemic-map"
import FundingTracker from "@/components/funding-tracker"

// Enhanced simulation data with more realistic progression
const simulationData = [
  { day: 0, infected: 10, recovered: 0, deaths: 0, funding: 500000, hospitalCapacity: 15 },
  { day: 7, infected: 45, recovered: 5, deaths: 2, funding: 480000, hospitalCapacity: 25 },
  { day: 14, infected: 180, recovered: 25, deaths: 8, funding: 450000, hospitalCapacity: 35 },
  { day: 21, infected: 520, recovered: 95, deaths: 25, funding: 400000, hospitalCapacity: 45 },
  { day: 28, infected: 1200, recovered: 280, deaths: 65, funding: 320000, hospitalCapacity: 65 },
  { day: 35, infected: 2100, recovered: 650, deaths: 140, funding: 250000, hospitalCapacity: 78 },
  { day: 42, infected: 3200, recovered: 1200, deaths: 280, funding: 180000, hospitalCapacity: 85 },
  { day: 49, infected: 4100, recovered: 1800, deaths: 380, funding: 120000, hospitalCapacity: 92 },
]

interface AIAgentResponse {
  agent: string
  response: string
  confidence: number
  timestamp: Date
  loading: boolean
}

export default function SimulationMonitorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(true)
  const [currentDay, setCurrentDay] = useState(42)
  const [progress, setProgress] = useState(35)
  const [aiResponses, setAiResponses] = useState<AIAgentResponse[]>([])
  const [activeAgents, setActiveAgents] = useState<string[]>([])

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

  // Simulate real-time updates
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentDay((prev) => {
          const newDay = prev + 1
          setProgress(Math.min((newDay / 120) * 100, 100))

          // Trigger AI analysis every 7 days
          if (newDay % 7 === 0) {
            triggerAIAnalysis(newDay)
          }

          return newDay
        })
      }, 3000) // Slower for demo purposes
      return () => clearInterval(interval)
    }
  }, [isRunning])

  const getCurrentSimulationData = () => {
    const dataIndex = Math.min(Math.floor(currentDay / 7), simulationData.length - 1)
    return simulationData[dataIndex]
  }

  const triggerAIAnalysis = async (day: number) => {
    const currentData = getCurrentSimulationData()
    const agents = ["policy", "logistics", "government", "sentiment", "funding"]

    // Randomly select 1-2 agents to respond
    const selectedAgents = agents.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1)

    for (const agentType of selectedAgents) {
      await getAIResponse(agentType, currentData, day)
    }
  }

  const getAIResponse = async (agentType: string, data: any, day: number) => {
    const agentId = `${agentType}_${Date.now()}`

    // Add loading state
    setAiResponses((prev) => [
      ...prev,
      {
        agent: agentType,
        response: "",
        confidence: 0,
        timestamp: new Date(),
        loading: true,
      },
    ])

    setActiveAgents((prev) => [...prev, agentType])

    try {
      let response = ""
      const agentData = {
        infection_rate: ((data.infected / 1000000) * 100).toFixed(2),
        vaccination_rate: Math.max(0, 60 - day * 0.5).toFixed(1),
        response_delay_days: Math.floor(Math.random() * 5) + 2,
        population_size: 1000000,
        disease_name: "COVID-19",
        region_name: "Nigeria",
        infection_count: data.infected,
        available_beds: Math.max(50, 200 - Math.floor(data.hospitalCapacity * 2)),
        available_medics: Math.max(20, 100 - Math.floor(data.hospitalCapacity)),
        medicine_level: Math.max(20, 100 - day * 2),
        funding: data.funding,
        policy_delay: Math.floor(Math.random() * 7) + 1,
        r0_value: (2.5 - day * 0.01).toFixed(2),
        active_cases: data.infected,
        fatality_rate: ((data.deaths / data.infected) * 100).toFixed(2),
        region: "Nigeria",
        sentiment_score: Math.max(3, 8 - Math.floor(day * 0.1)),
        distrust_percentage: Math.min(60, 20 + Math.floor(day * 0.5)),
        compliance_level: Math.max(40, 80 - Math.floor(day * 0.3)),
        gov_wallet: Math.floor(data.funding * 0.4),
        ngo_wallet: Math.floor(data.funding * 0.3),
        urgency_score: Math.min(10, Math.floor(data.hospitalCapacity / 10)),
        regional_needs_summary: "Medical supplies, Hospital beds, Healthcare workers",
      }

      let prompt = ""

      switch (agentType) {
        case "policy":
          prompt = `As a policy advisor, analyze the following COVID-19 situation in Nigeria on day ${day}:
          - Infection rate: ${agentData.infection_rate}%
          - Vaccination rate: ${agentData.vaccination_rate}%
          - Response delay: ${agentData.response_delay_days} days
          - Population size: ${agentData.population_size}
          - Disease: ${agentData.disease_name}
          - Region: ${agentData.region_name}
          - Infection count: ${agentData.infection_count}
          - Available beds: ${agentData.available_beds}
          - Available medics: ${agentData.available_medics}
          - Medicine level: ${agentData.medicine_level}
          - Funding: ${agentData.funding}
          - Policy delay: ${agentData.policy_delay}
          - R0 value: ${agentData.r0_value}
          - Active cases: ${agentData.active_cases}
          - Fatality rate: ${agentData.fatality_rate}%
          - Gov Wallet: ${agentData.gov_wallet}
          - NGO Wallet: ${agentData.ngo_wallet}
          - Urgency Score: ${agentData.urgency_score}
          - Regional Needs Summary: ${agentData.regional_needs_summary}

          Provide a concise policy recommendation.`
          response = await queryGeminiAgent(prompt)
          break
        case "logistics":
          prompt = `As a logistics expert, analyze the following COVID-19 situation in Nigeria on day ${day}:
          - Infection rate: ${agentData.infection_rate}%
          - Vaccination rate: ${agentData.vaccination_rate}%
          - Response delay: ${agentData.response_delay_days} days
          - Population size: ${agentData.population_size}
          - Disease: ${agentData.disease_name}
          - Region: ${agentData.region_name}
          - Infection count: ${agentData.infection_count}
          - Available beds: ${agentData.available_beds}
          - Available medics: ${agentData.available_medics}
          - Medicine level: ${agentData.medicine_level}
          - Funding: ${agentData.funding}
          - Policy delay: ${agentData.policy_delay}
          - R0 value: ${agentData.r0_value}
          - Active cases: ${agentData.active_cases}
          - Fatality rate: ${agentData.fatality_rate}%
          - Gov Wallet: ${agentData.gov_wallet}
          - NGO Wallet: ${agentData.ngo_wallet}
          - Urgency Score: ${agentData.urgency_score}
          - Regional Needs Summary: ${agentData.regional_needs_summary}

          Provide a concise logistics recommendation.`
          response = await queryGeminiAgent(prompt)
          break
        case "government":
          prompt = `As a government official, analyze the following COVID-19 situation in Nigeria on day ${day}:
          - Infection rate: ${agentData.infection_rate}%
          - Vaccination rate: ${agentData.vaccination_rate}%
          - Response delay: ${agentData.response_delay_days} days
          - Population size: ${agentData.population_size}
          - Disease: ${agentData.disease_name}
          - Region: ${agentData.region_name}
          - Infection count: ${agentData.infection_count}
          - Available beds: ${agentData.available_beds}
          - Available medics: ${agentData.available_medics}
          - Medicine level: ${agentData.medicine_level}
          - Funding: ${agentData.funding}
          - Policy delay: ${agentData.policy_delay}
          - R0 value: ${agentData.r0_value}
          - Active cases: ${agentData.active_cases}
          - Fatality rate: ${agentData.fatality_rate}%
          - Gov Wallet: ${agentData.gov_wallet}
          - NGO Wallet: ${agentData.ngo_wallet}
          - Urgency Score: ${agentData.urgency_score}
          - Regional Needs Summary: ${agentData.regional_needs_summary}

          Provide a concise government recommendation.`
          response = await queryGeminiAgent(prompt)
          break
        case "sentiment":
          prompt = `As a public sentiment analyst, analyze the following COVID-19 situation in Nigeria on day ${day}:
          - Infection rate: ${agentData.infection_rate}%
          - Vaccination rate: ${agentData.vaccination_rate}%
          - Response delay: ${agentData.response_delay_days} days
          - Population size: ${agentData.population_size}
          - Disease: ${agentData.disease_name}
          - Region: ${agentData.region_name}
          - Infection count: ${agentData.infection_count}
          - Available beds: ${agentData.available_beds}
          - Available medics: ${agentData.available_medics}
          - Medicine level: ${agentData.medicine_level}
          - Funding: ${agentData.funding}
          - Policy delay: ${agentData.policy_delay}
          - R0 value: ${agentData.r0_value}
          - Active cases: ${agentData.active_cases}
          - Fatality rate: ${agentData.fatality_rate}%
          - Sentiment score: ${agentData.sentiment_score}
          - Distrust percentage: ${agentData.distrust_percentage}%
          - Compliance level: ${agentData.compliance_level}%
          - Gov Wallet: ${agentData.gov_wallet}
          - NGO Wallet: ${agentData.ngo_wallet}
          - Urgency Score: ${agentData.urgency_score}
          - Regional Needs Summary: ${agentData.regional_needs_summary}

          Provide a concise public sentiment analysis.`
          response = await queryGeminiAgent(prompt)
          break
        case "funding":
          prompt = `As a funding evaluator, analyze the following COVID-19 situation in Nigeria on day ${day}:
          - Infection rate: ${agentData.infection_rate}%
          - Vaccination rate: ${agentData.vaccination_rate}%
          - Response delay: ${agentData.response_delay_days} days
          - Population size: ${agentData.population_size}
          - Disease: ${agentData.disease_name}
          - Region: ${agentData.region_name}
          - Infection count: ${agentData.infection_count}
          - Available beds: ${agentData.available_beds}
          - Available medics: ${agentData.available_medics}
          - Medicine level: ${agentData.medicine_level}
          - Funding: ${agentData.funding}
          - Policy delay: ${agentData.policy_delay}
          - R0 value: ${agentData.r0_value}
          - Active cases: ${agentData.active_cases}
          - Fatality rate: ${agentData.fatality_rate}%
          - Gov Wallet: ${agentData.gov_wallet}
          - NGO Wallet: ${agentData.ngo_wallet}
          - Urgency Score: ${agentData.urgency_score}
          - Regional Needs Summary: ${agentData.regional_needs_summary}

          Provide a concise funding evaluation.`
          response = await queryGeminiAgent(prompt)
          break
        default:
          response = "Agent response not available"
      }

      // Update with actual response
      setAiResponses((prev) =>
        prev.map((item) =>
          item.agent === agentType && item.loading
            ? {
                ...item,
                response: response,
                confidence: Math.floor(Math.random() * 20) + 80,
                loading: false,
              }
            : item,
        ),
      )

      toast({
        title: `${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent Update`,
        description: `New analysis available for Day ${day}`,
      })
    } catch (error) {
      console.error(`Error getting ${agentType} response:`, error)

      // Update with error state
      setAiResponses((prev) =>
        prev.map((item) =>
          item.agent === agentType && item.loading
            ? {
                ...item,
                response: "Unable to generate response. Please try again.",
                confidence: 0,
                loading: false,
              }
            : item,
        ),
      )

      toast({
        title: "AI Agent Error",
        description: `Failed to get response from ${agentType} agent`,
        variant: "destructive",
      })
    } finally {
      setActiveAgents((prev) => prev.filter((agent) => agent !== agentType))
    }
  }

  const manuallyTriggerAgent = async (agentType: string) => {
    const currentData = getCurrentSimulationData()
    await getAIResponse(agentType, currentData, currentDay)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <motion.div
          className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    )
  }

  const currentData = getCurrentSimulationData()

  return (
    <motion.div
      className="min-h-screen bg-gray-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Link href="/simulation/builder">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Builder
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">COVID-19 Nigeria Simulation</h1>
              <p className="text-gray-400">Urban spread analysis • Day {currentDay} of 120</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant="outline"
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              onClick={() => {
                setIsRunning(false)
                toast({
                  title: "Simulation Stopped",
                  description: "The simulation has been stopped successfully.",
                })
              }}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast({
                  title: "Export Started",
                  description: "Generating comprehensive simulation report...",
                })
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlowCard glowColor="blue" intensity="medium" className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Badge
                  variant={isRunning ? "default" : "secondary"}
                  className={isRunning ? "bg-green-600" : "bg-gray-600"}
                >
                  {isRunning ? "Running" : "Paused"}
                </Badge>
                <span className="text-white">Day {currentDay} / 120</span>
                {activeAgents.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    <span className="text-blue-400 text-sm">AI Analyzing...</span>
                  </div>
                )}
              </div>
              <span className="text-gray-400">{progress.toFixed(1)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </GlowCard>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Current Infected",
              value: currentData.infected.toLocaleString(),
              change: "+12% from yesterday",
              icon: TrendingUp,
              color: "text-red-400",
            },
            {
              title: "Recovered",
              value: currentData.recovered.toLocaleString(),
              change: "+8% from yesterday",
              icon: Users,
              color: "text-green-400",
            },
            {
              title: "Deaths",
              value: currentData.deaths.toString(),
              change: "+5% from yesterday",
              icon: AlertTriangle,
              color: "text-gray-400",
            },
            {
              title: "Funding Remaining",
              value: `₳ ${currentData.funding.toLocaleString()}`,
              change: "64% of initial",
              icon: Shield,
              color: "text-yellow-400",
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <GlowCard glowColor="purple" intensity="low" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.change}</p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700 grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="data-[state=active]:bg-gray-700">
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-gray-700">
              Geographic
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="data-[state=active]:bg-gray-700">
              Blockchain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Disease Spread Chart */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <GlowCard glowColor="red" intensity="medium" className="p-6">
                  <CardHeader>
                    <CardTitle className="text-white">Disease Spread Timeline</CardTitle>
                    <CardDescription className="text-gray-400">
                      Infected, recovered, and deaths over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={simulationData.slice(0, Math.ceil(currentDay / 7))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="infected" stroke="#EF4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="recovered" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="deaths" stroke="#6B7280" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </GlowCard>
              </motion.div>

              {/* Funding Flow Chart */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <GlowCard glowColor="yellow" intensity="medium" className="p-6">
                  <CardHeader>
                    <CardTitle className="text-white">Funding Utilization</CardTitle>
                    <CardDescription className="text-gray-400">Blockchain-tracked funding over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={simulationData.slice(0, Math.ceil(currentDay / 7))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Area type="monotone" dataKey="funding" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </GlowCard>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="ai-agents" className="space-y-6">
            {/* Manual Agent Triggers */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlowCard glowColor="purple" intensity="medium" className="p-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Agent Control Panel
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manually trigger AI analysis from different agent perspectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { id: "policy", name: "Policy Advisor", color: "bg-blue-600 hover:bg-blue-700" },
                      { id: "logistics", name: "Logistics", color: "bg-green-600 hover:bg-green-700" },
                      { id: "government", name: "Government", color: "bg-red-600 hover:bg-red-700" },
                      { id: "sentiment", name: "Public Sentiment", color: "bg-purple-600 hover:bg-purple-700" },
                      { id: "funding", name: "Funding", color: "bg-yellow-600 hover:bg-yellow-700" },
                    ].map((agent) => (
                      <Button
                        key={agent.id}
                        onClick={() => manuallyTriggerAgent(agent.id)}
                        disabled={activeAgents.includes(agent.id)}
                        className={`${agent.color} text-white text-xs px-3 py-2 h-auto`}
                      >
                        {activeAgents.includes(agent.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-3 w-3 mr-1" />
                        )}
                        {agent.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* AI Responses */}
            <div className="space-y-4">
              <AnimatePresence>
                {aiResponses
                  .slice(-6)
                  .reverse()
                  .map((response, index) => (
                    <motion.div
                      key={`${response.agent}_${response.timestamp.getTime()}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GlowCard glowColor="cyan" intensity="low" className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Brain className="h-5 w-5 text-cyan-400" />
                            <div>
                              <h3 className="font-semibold text-white capitalize">
                                {response.agent.replace("_", " ")} Agent
                              </h3>
                              <p className="text-xs text-gray-400">{response.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </div>
                          {!response.loading && (
                            <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                              {response.confidence}% Confidence
                            </Badge>
                          )}
                        </div>

                        {response.loading ? (
                          <div className="flex items-center space-x-3 py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                            <span className="text-gray-400">Analyzing current situation...</span>
                          </div>
                        ) : (
                          <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {response.response}
                            </p>
                          </div>
                        )}
                      </GlowCard>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {aiResponses.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No AI responses yet</p>
                  <p className="text-gray-500 text-sm">
                    AI agents will automatically analyze the situation every 7 days
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlowCard glowColor="green" intensity="medium" className="p-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Live Outbreak Map - Nigeria
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time disease spread visualization with interactive hotspots
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EpidemicMap currentDay={currentDay} isRunning={isRunning} />
                </CardContent>
              </GlowCard>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { city: "Lagos", cases: 1847, growth: "+15%/day", capacity: "78%", color: "text-red-400" },
                { city: "Abuja", cases: 623, growth: "+8%/day", capacity: "45%", color: "text-yellow-400" },
                { city: "Kano", cases: 284, growth: "+22%/day", capacity: "32%", color: "text-green-400" },
              ].map((location, index) => (
                <motion.div
                  key={location.city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlowCard glowColor="blue" intensity="low" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white">{location.city}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {index === 0
                          ? "Primary outbreak center"
                          : index === 1
                            ? "Secondary spread"
                            : "Emerging hotspot"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cases:</span>
                          <span className={`font-bold ${location.color}`}>{location.cases.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Growth Rate:</span>
                          <span className="text-white">{location.growth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Hospital Capacity:</span>
                          <span className={location.capacity.includes("78") ? "text-red-400" : "text-green-400"}>
                            {location.capacity}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <FundingTracker />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
