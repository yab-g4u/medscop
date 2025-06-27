"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Shield, Brain, TrendingUp, Activity, Play, Zap, Hexagon, Globe, Users } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { GlowCard } from "@/components/ui/glow-card"
import { GlowButton } from "@/components/ui/glow-button"
import { Badge } from "@/components/ui/badge"
import { blockfrostClient } from "@/lib/blockfrost/client"

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [blockchainData, setBlockchainData] = useState<any>(null)
  const supabase = createClient()

  // Animation refs
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Fetch blockchain data
    const fetchBlockchainData = async () => {
      try {
        const [latestBlock, genesis] = await Promise.all([
          blockfrostClient.getLatestBlock(),
          blockfrostClient.getGenesis(),
        ])
        setBlockchainData({ latestBlock, genesis })
      } catch (error) {
        console.error("Failed to fetch blockchain data:", error)
      }
    }
    fetchBlockchainData()
  }, [supabase.auth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75" />
                <div className="relative p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                MEDSCOPE
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Solutions", "Blockchain", "About"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {blockchainData && (
                <motion.div
                  className="hidden lg:flex items-center space-x-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-gray-400">Block #{blockchainData.latestBlock.height}</span>
                  </div>
                  <div className="text-gray-500">|</div>
                  <span className="text-cyan-400">Cardano Live</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {user ? (
                  <Link href="/dashboard">
                    <GlowButton glowColor="cyan" size="md">
                      Dashboard
                    </GlowButton>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <GlowButton glowColor="cyan" size="md">
                      Join Network
                    </GlowButton>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div className="text-center relative z-10" style={{ y, opacity }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-8 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 px-6 py-3 text-lg font-medium">
                <Zap className="h-5 w-5 mr-2" />
                Web3 • AI-Powered • Blockchain-Verified
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="block bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                AI + BLOCKCHAIN TO
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-4">
                STOP THE NEXT EPIDEMIC
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The world's first Web3 epidemic simulation platform that combines AI agents with blockchain transparency
              to help governments, NGOs, and researchers prepare for health crises before they escalate.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href={user ? "/simulation/builder" : "/auth"}>
                <GlowButton glowColor="cyan" size="lg" className="min-w-[200px] group">
                  <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span>Run Live Simulation</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </GlowButton>
              </Link>
              <GlowButton variant="outline" glowColor="blue" size="lg" className="min-w-[200px] group">
                <span>Watch Demo</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </GlowButton>
            </motion.div>

            {/* Blockchain Stats */}
            {blockchainData && (
              <motion.div
                className="flex flex-wrap justify-center gap-8 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <Hexagon className="h-4 w-4 text-cyan-400" />
                  <span className="text-gray-400">Latest Block:</span>
                  <span className="text-white font-mono">#{blockchainData.latestBlock.height}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-gray-400">Network:</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Transactions:</span>
                  <span className="text-blue-400">{blockchainData.latestBlock.tx_count}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Feature Cards - Investor Focused */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-24"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {/* Left Card - Africa Focus */}
            <GlowCard glowColor="cyan" intensity="high" className="p-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">🌍 Africa's First Epidemic Strategy Simulator</h3>
                    <p className="text-cyan-400 text-sm">Continental Scale Impact</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  Simulate, fund, and manage outbreaks before they happen — powered by blockchain and autonomous agents.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">54 African countries supported</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
                    <span className="text-gray-300">Real-time disease modeling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Transparent funding flows</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Market Opportunity</div>
                  <div className="text-white text-2xl font-bold">$2.3B+ African Health Tech Market</div>
                </div>
              </div>
            </GlowCard>

            {/* Right Card - Enterprise Focus */}
            <GlowCard glowColor="purple" intensity="high" className="p-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">🚀 Built for Ministries, NGOs & Researchers</h3>
                    <p className="text-purple-400 text-sm">Enterprise-Ready Platform</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  Bridge real data, transparent funding, and AI recommendations to design stronger health responses.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Government health ministries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-100" />
                    <span className="text-gray-300">International NGOs & aid organizations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Research institutions & universities</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <div className="text-purple-400 text-sm font-medium mb-1">Revenue Model</div>
                  <div className="text-white text-2xl font-bold">SaaS + Premium Analytics</div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Next-Generation Technology Stack
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Powered by cutting-edge AI and blockchain technology for unprecedented accuracy and transparency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "CrewAI Multi-Agent System",
                description:
                  "Advanced AI agents working in parallel to provide strategic policy recommendations, logistics optimization, and real-time decision coordination.",
                color: "purple",
                features: [
                  "Strategic Policy Analysis",
                  "Resource Allocation Optimization",
                  "Real-time Decision Coordination",
                ],
              },
              {
                icon: Shield,
                title: "Cardano Blockchain Integration",
                description:
                  "Transparent funding flows on Cardano mainnet with DID verification, immutable audit trails, and real-time transaction monitoring.",
                color: "green",
                features: ["On-chain Payment Logging", "Funding Delay Simulation", "Transparent Agent Wallets"],
              },
              {
                icon: TrendingUp,
                title: "Real-Time Simulation Engine",
                description:
                  "Interactive disease modeling with dynamic parameter adjustment, real-time visualization, and predictive analytics.",
                color: "blue",
                features: ["Disease Spread Visualization", "Impact Timeline Tracking", "Outcome Prediction & Export"],
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <GlowCard glowColor={feature.color as any} intensity="medium" className="p-6 sm:p-8 group h-full">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-500/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300`}
                    />
                    <div className="relative">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                      <div className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <div key={item} className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 bg-${feature.color}-400 rounded-full animate-pulse`}
                              style={{ animationDelay: `${idx * 100}ms` }}
                            />
                            <span className="text-gray-300 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Transform Public Health?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed">
            Join the next generation of epidemic preparedness with AI and blockchain technology. Start your simulation
            today and be part of the future.
          </p>
          <Link href={user ? "/simulation/builder" : "/auth"}>
            <GlowButton glowColor="cyan" size="lg" className="min-w-[250px] group">
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Launch Platform</span>
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </GlowButton>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="flex items-center space-x-3 mb-6 md:mb-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75" />
                <div className="relative p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                MEDSCOPE
              </span>
            </motion.div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              © 2024 Medscope. Powered by Cardano • Built for African Public Health Innovation
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
      `}</style>
    </div>
  )
}
