"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Upload,
  Users,
  MapPin,
  Calendar,
  Brain,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { GlowButton } from "@/components/ui/glow-button"
import { GlowCard } from "@/components/ui/glow-card"
import { masumiClient } from "@/lib/masumi/client"
import { toast } from "@/hooks/use-toast"

interface SimulationConfig {
  name: string
  disease: string
  region: string
  population: number
  transmissionRate: number
  mortalityRate: number
  duration: number
  fundingAmount: number
  selectedAgents: string[]
  description: string
  climateImpact: string
  populationDensity: string
  healthcareCapacity: number
  fundingSource: string
  paymentDelays: string
}

export default function SimulationBuilderPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [buildingSimulation, setBuildingSimulation] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")

  // Simulation configuration state
  const [config, setConfig] = useState<SimulationConfig>({
    name: "",
    disease: "",
    region: "",
    population: 1000000,
    transmissionRate: 0.3,
    mortalityRate: 0.02,
    duration: 180,
    fundingAmount: 500000,
    selectedAgents: ["policy", "logistics"],
    description: "",
    climateImpact: "",
    populationDensity: "",
    healthcareCapacity: 75,
    fundingSource: "",
    paymentDelays: "",
  })

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

  const handleAgentToggle = (agentId: string) => {
    setConfig((prev) => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(agentId)
        ? prev.selectedAgents.filter((id) => id !== agentId)
        : [...prev.selectedAgents, agentId],
    }))
  }

  const handleStartSimulation = async () => {
    if (!config.name || !config.disease || !config.region) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before starting the simulation.",
        variant: "destructive",
      })
      return
    }

    setBuildingSimulation(true)

    try {
      // Step 1: Register AI agents with Masumi
      toast({
        title: "Initializing Simulation",
        description: "Setting up AI agents and blockchain wallets...",
      })

      const agentPromises = config.selectedAgents.map(async (agentRole) => {
        const agentConfig = {
          role: agentRole,
          name: `${agentRole.charAt(0).toUpperCase() + agentRole.slice(1)} Agent`,
          initialFunding: Math.floor(config.fundingAmount / config.selectedAgents.length),
          permissions: ["read", "write", "transfer"],
        }

        return await masumiClient.registerAgent(agentConfig)
      })

      const agents = await Promise.all(agentPromises)

      // Step 2: Create simulation record
      const simulationData = {
        ...config,
        agents: agents.map((agent) => ({
          id: agent.id,
          role: agent.role,
          walletAddress: agent.walletAddress,
          did: agent.did,
        })),
        userId: user?.id,
        status: "initialized",
        createdAt: new Date().toISOString(),
      }

      // Store simulation in localStorage for demo (in production, use Supabase)
      localStorage.setItem("currentSimulation", JSON.stringify(simulationData))

      toast({
        title: "Simulation Created Successfully!",
        description: `${agents.length} AI agents initialized with blockchain wallets.`,
      })

      // Step 3: Redirect to simulation monitor
      setTimeout(() => {
        router.push("/simulation/monitor")
      }, 2000)
    } catch (error) {
      console.error("Failed to start simulation:", error)
      toast({
        title: "Simulation Failed",
        description: "There was an error starting your simulation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBuildingSimulation(false)
    }
  }

  const loadPreset = (presetName: string) => {
    const presets = {
      ebola: {
        name: "Ebola West Africa 2024",
        disease: "ebola",
        region: "west-africa",
        population: 2500000,
        transmissionRate: 0.4,
        mortalityRate: 0.6,
        duration: 365,
        fundingAmount: 2000000,
        description:
          "Simulating Ebola outbreak response in West African region with focus on cross-border coordination.",
      },
      covid: {
        name: "COVID-19 Urban Spread",
        disease: "covid19",
        region: "nigeria",
        population: 15000000,
        transmissionRate: 0.25,
        mortalityRate: 0.02,
        duration: 180,
        fundingAmount: 5000000,
        description: "Urban COVID-19 spread simulation focusing on high-density population centers.",
      },
      cholera: {
        name: "Cholera Emergency Response",
        disease: "cholera",
        region: "east-africa",
        population: 800000,
        transmissionRate: 0.35,
        mortalityRate: 0.05,
        duration: 120,
        fundingAmount: 1000000,
        description: "Rapid cholera outbreak response with emphasis on water and sanitation interventions.",
      },
    }

    const preset = presets[presetName as keyof typeof presets]
    if (preset) {
      setConfig((prev) => ({ ...prev, ...preset }))
      toast({
        title: "Preset Loaded",
        description: `${preset.name} configuration has been applied.`,
      })
    }
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

  const isConfigValid = config.name && config.disease && config.region
  const completionPercentage = Math.round(
    (((config.name ? 1 : 0) +
      (config.disease ? 1 : 0) +
      (config.region ? 1 : 0) +
      (config.selectedAgents.length > 0 ? 1 : 0)) /
      4) *
      100,
  )

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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Simulation Builder</h1>
              <p className="text-gray-400">Configure your epidemic simulation parameters</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Configuration Complete</div>
              <div className="text-2xl font-bold text-cyan-400">{completionPercentage}%</div>
            </div>
            <GlowButton
              onClick={handleStartSimulation}
              glowColor="cyan"
              size="lg"
              disabled={!isConfigValid || buildingSimulation}
              className="min-w-[200px]"
            >
              {buildingSimulation ? (
                <motion.div className="flex items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Building...</span>
                </motion.div>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </>
              )}
            </GlowButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList className="bg-gray-800 border-gray-700 grid grid-cols-4 w-full">
                <TabsTrigger value="basic" className="data-[state=active]:bg-gray-700">
                  Basic Setup
                </TabsTrigger>
                <TabsTrigger value="parameters" className="data-[state=active]:bg-gray-700">
                  Parameters
                </TabsTrigger>
                <TabsTrigger value="agents" className="data-[state=active]:bg-gray-700">
                  AI Agents
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="data-[state=active]:bg-gray-700">
                  Blockchain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlowCard glowColor="blue" intensity="medium" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Simulation Details
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Basic information about your simulation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Simulation Name *
                        </Label>
                        <Input
                          id="name"
                          value={config.name}
                          onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="e.g., Ebola West Africa 2024"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="disease" className="text-white">
                            Disease Type *
                          </Label>
                          <Select
                            value={config.disease}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, disease: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select disease" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="ebola">Ebola</SelectItem>
                              <SelectItem value="covid19">COVID-19</SelectItem>
                              <SelectItem value="malaria">Malaria</SelectItem>
                              <SelectItem value="cholera">Cholera</SelectItem>
                              <SelectItem value="yellow-fever">Yellow Fever</SelectItem>
                              <SelectItem value="custom">Custom Disease</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="region" className="text-white">
                            Region *
                          </Label>
                          <Select
                            value={config.region}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, region: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="west-africa">West Africa</SelectItem>
                              <SelectItem value="east-africa">East Africa</SelectItem>
                              <SelectItem value="central-africa">Central Africa</SelectItem>
                              <SelectItem value="southern-africa">Southern Africa</SelectItem>
                              <SelectItem value="nigeria">Nigeria</SelectItem>
                              <SelectItem value="kenya">Kenya</SelectItem>
                              <SelectItem value="ghana">Ghana</SelectItem>
                              <SelectItem value="custom">Custom Region</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Description (Optional)</Label>
                        <Textarea
                          value={config.description}
                          onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Describe the simulation scenario..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </GlowCard>

                  <GlowCard glowColor="green" intensity="medium" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Upload className="h-5 w-5 mr-2" />
                        Data Import
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Upload CSV data or use preset configurations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">Drop your CSV file here or click to browse</p>
                        <p className="text-gray-500 text-sm">
                          Supports population, case data, and geographic information
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                          onClick={() => {
                            toast({
                              title: "File Upload",
                              description: "CSV file upload functionality will be available in the next update.",
                            })
                          }}
                        >
                          Choose File
                        </Button>
                      </div>
                    </CardContent>
                  </GlowCard>
                </motion.div>
              </TabsContent>

              <TabsContent value="parameters" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlowCard glowColor="purple" intensity="medium" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white">Disease Parameters</CardTitle>
                      <CardDescription className="text-gray-400">
                        Configure transmission and mortality rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-white">Population Size</Label>
                          <span className="text-blue-400 font-mono">{config.population.toLocaleString()}</span>
                        </div>
                        <Slider
                          value={[config.population]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, population: value[0] }))}
                          max={10000000}
                          min={10000}
                          step={10000}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-white">Transmission Rate</Label>
                          <span className="text-blue-400 font-mono">{(config.transmissionRate * 100).toFixed(1)}%</span>
                        </div>
                        <Slider
                          value={[config.transmissionRate]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, transmissionRate: value[0] }))}
                          max={1}
                          min={0.01}
                          step={0.01}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-white">Mortality Rate</Label>
                          <span className="text-blue-400 font-mono">{(config.mortalityRate * 100).toFixed(2)}%</span>
                        </div>
                        <Slider
                          value={[config.mortalityRate]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, mortalityRate: value[0] }))}
                          max={0.5}
                          min={0.001}
                          step={0.001}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-white">Simulation Duration</Label>
                          <span className="text-blue-400 font-mono">{config.duration} days</span>
                        </div>
                        <Slider
                          value={[config.duration]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, duration: value[0] }))}
                          max={365}
                          min={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </GlowCard>

                  <GlowCard glowColor="cyan" intensity="medium" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white">Environmental Factors</CardTitle>
                      <CardDescription className="text-gray-400">
                        Additional parameters affecting disease spread
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Climate Impact</Label>
                          <Select
                            value={config.climateImpact}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, climateImpact: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select climate" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="tropical">Tropical</SelectItem>
                              <SelectItem value="arid">Arid</SelectItem>
                              <SelectItem value="temperate">Temperate</SelectItem>
                              <SelectItem value="humid">Humid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Population Density</Label>
                          <Select
                            value={config.populationDensity}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, populationDensity: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select density" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="urban">Urban (High)</SelectItem>
                              <SelectItem value="suburban">Suburban (Medium)</SelectItem>
                              <SelectItem value="rural">Rural (Low)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-white">Healthcare Capacity</Label>
                          <span className="text-blue-400 font-mono">{config.healthcareCapacity}%</span>
                        </div>
                        <Slider
                          value={[config.healthcareCapacity]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, healthcareCapacity: value[0] }))}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </GlowCard>
                </motion.div>
              </TabsContent>

              <TabsContent value="agents" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlowCard glowColor="purple" intensity="medium" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        CrewAI Agent Configuration
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Select and configure AI agents for your simulation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            id: "policy",
                            name: "Policy Advisor",
                            description: "Provides strategic policy recommendations and lockdown timing analysis",
                            features: ["Lockdown optimization", "Resource allocation", "Public health measures"],
                          },
                          {
                            id: "logistics",
                            name: "Logistics Coordinator",
                            description: "Optimizes supply chain and resource distribution across regions",
                            features: [
                              "Supply chain optimization",
                              "Medical equipment distribution",
                              "Transportation logistics",
                            ],
                          },
                          {
                            id: "government",
                            name: "Government Delay",
                            description: "Simulates bureaucratic delays and approval processes",
                            features: [
                              "Approval process simulation",
                              "Bureaucratic delay modeling",
                              "Decision timeline impact",
                            ],
                          },
                          {
                            id: "hospital",
                            name: "Hospital Manager",
                            description: "Manages hospital capacity and patient flow optimization",
                            features: ["Capacity management", "Patient flow optimization", "Resource prioritization"],
                          },
                        ].map((agent) => {
                          const isSelected = config.selectedAgents.includes(agent.id)

                          return (
                            <motion.div
                              key={agent.id}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "border-blue-500 bg-blue-900/20"
                                  : "border-gray-600 bg-gray-700 hover:border-gray-500"
                              }`}
                              onClick={() => handleAgentToggle(agent.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-white">{agent.name}</h3>
                                <Badge variant={isSelected ? "default" : "secondary"}>
                                  {isSelected ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Selected
                                    </>
                                  ) : (
                                    "Available"
                                  )}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm mb-3">{agent.description}</p>
                              <div className="space-y-1">
                                {agent.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 text-xs text-gray-500">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>

                      {config.selectedAgents.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-medium">No agents selected</span>
                          </div>
                          <p className="text-yellow-300 text-sm mt-1">
                            Please select at least one AI agent to run the simulation.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </GlowCard>
                </motion.div>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlowCard glowColor="green" intensity="medium" className="p-6">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Masumi Blockchain Configuration
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Configure funding flows and transparency tracking
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-white">Initial Funding Pool</Label>
                          <span className="text-blue-400 font-mono">₳ {config.fundingAmount.toLocaleString()}</span>
                        </div>
                        <Slider
                          value={[config.fundingAmount]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, fundingAmount: value[0] }))}
                          max={5000000}
                          min={50000}
                          step={50000}
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Funding Source</Label>
                          <Select
                            value={config.fundingSource}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, fundingSource: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="who">World Health Organization</SelectItem>
                              <SelectItem value="gates">Gates Foundation</SelectItem>
                              <SelectItem value="government">Government Budget</SelectItem>
                              <SelectItem value="ngo">NGO Consortium</SelectItem>
                              <SelectItem value="mixed">Mixed Sources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Payment Delays</Label>
                          <Select
                            value={config.paymentDelays}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, paymentDelays: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select delay model" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="none">No Delays</SelectItem>
                              <SelectItem value="minimal">Minimal (1-3 days)</SelectItem>
                              <SelectItem value="moderate">Moderate (1-2 weeks)</SelectItem>
                              <SelectItem value="severe">Severe (1+ months)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Agent Wallet Setup</h4>
                        <p className="text-gray-400 text-sm mb-3">
                          Each AI agent will receive a DID-verified wallet on Cardano testnet
                        </p>
                        <div className="space-y-2">
                          {config.selectedAgents.map((agentId) => {
                            const allocation = Math.floor(config.fundingAmount / config.selectedAgents.length)
                            return (
                              <div key={agentId} className="flex justify-between text-sm">
                                <span className="text-gray-400 capitalize">{agentId} Agent:</span>
                                <span className="text-white">₳ {allocation.toLocaleString()}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </GlowCard>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Simulation Preview */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <GlowCard glowColor="cyan" intensity="medium" className="p-6">
                <CardHeader>
                  <CardTitle className="text-white">Simulation Preview</CardTitle>
                  <CardDescription className="text-gray-400">Current configuration summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{config.name || "Untitled"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Disease:</span>
                      <span className="text-white">{config.disease || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Region:</span>
                      <span className="text-white">{config.region || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Population:</span>
                      <span className="text-white">{config.population.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{config.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">AI Agents:</span>
                      <span className="text-white">{config.selectedAgents.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Funding:</span>
                      <span className="text-white">₳ {config.fundingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {!isConfigValid && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">Missing Required Fields</span>
                      </div>
                      <p className="text-red-300 text-xs mt-1">
                        Please complete all required fields to start simulation.
                      </p>
                    </div>
                  )}
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* Quick Presets */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <GlowCard glowColor="purple" intensity="medium" className="p-6">
                <CardHeader>
                  <CardTitle className="text-white">Quick Presets</CardTitle>
                  <CardDescription className="text-gray-400">Load predefined simulation scenarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    onClick={() => loadPreset("ebola")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Ebola Outbreak
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    onClick={() => loadPreset("covid")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    COVID-19 Urban
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    onClick={() => loadPreset("cholera")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Cholera Response
                  </Button>
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* Help & Documentation */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <GlowCard glowColor="blue" intensity="medium" className="p-6">
                <CardHeader>
                  <CardTitle className="text-white">Need Help?</CardTitle>
                  <CardDescription className="text-gray-400">Resources and documentation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    onClick={() => {
                      toast({
                        title: "Documentation",
                        description: "Simulation guide will open in a new tab.",
                      })
                    }}
                  >
                    📖 Simulation Guide
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    onClick={() => {
                      toast({
                        title: "AI Documentation",
                        description: "AI agent documentation will open in a new tab.",
                      })
                    }}
                  >
                    🤖 AI Agent Documentation
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    onClick={() => {
                      toast({
                        title: "Blockchain Guide",
                        description: "Blockchain integration guide will open in a new tab.",
                      })
                    }}
                  >
                    ⛓️ Blockchain Integration
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    onClick={() => {
                      toast({
                        title: "Community Support",
                        description: "Community support forum will open in a new tab.",
                      })
                    }}
                  >
                    💬 Community Support
                  </Button>
                </CardContent>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
