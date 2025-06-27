"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface RegionData {
  name: string
  cases: number
  deaths: number
  recovered: number
  severity: "low" | "medium" | "high" | "critical"
  coordinates: { x: number; y: number }
}

interface EpidemicMapProps {
  currentDay: number
  isRunning: boolean
}

export default function EpidemicMap({ currentDay, isRunning }: EpidemicMapProps) {
  const [regions, setRegions] = useState<RegionData[]>([
    {
      name: "Lagos",
      cases: 1847,
      deaths: 68,
      recovered: 1200,
      severity: "critical",
      coordinates: { x: 45, y: 75 },
    },
    {
      name: "Abuja",
      cases: 623,
      deaths: 23,
      recovered: 450,
      severity: "high",
      coordinates: { x: 55, y: 45 },
    },
    {
      name: "Kano",
      cases: 284,
      deaths: 12,
      recovered: 180,
      severity: "medium",
      coordinates: { x: 65, y: 25 },
    },
    {
      name: "Port Harcourt",
      cases: 156,
      deaths: 8,
      recovered: 98,
      severity: "medium",
      coordinates: { x: 50, y: 85 },
    },
    {
      name: "Kaduna",
      cases: 89,
      deaths: 4,
      recovered: 62,
      severity: "low",
      coordinates: { x: 60, y: 35 },
    },
  ])

  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setRegions((prev) =>
          prev.map((region) => ({
            ...region,
            cases: Math.floor(region.cases * (1 + Math.random() * 0.1)),
            deaths: Math.floor(region.deaths * (1 + Math.random() * 0.05)),
            recovered: Math.floor(region.recovered * (1 + Math.random() * 0.15)),
          })),
        )
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isRunning])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeveritySize = (severity: string) => {
    switch (severity) {
      case "critical":
        return "w-6 h-6"
      case "high":
        return "w-5 h-5"
      case "medium":
        return "w-4 h-4"
      case "low":
        return "w-3 h-3"
      default:
        return "w-2 h-2"
    }
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/20 to-green-900/20 rounded-lg overflow-hidden border border-gray-700">
      {/* Nigeria Map Outline */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 20 L80 20 L85 30 L80 40 L85 50 L80 60 L85 70 L80 80 L20 80 L15 70 L20 60 L15 50 L20 40 L15 30 Z"
          stroke="#374151"
          strokeWidth="0.5"
          fill="rgba(59, 130, 246, 0.1)"
        />
      </svg>

      {/* Outbreak Hotspots */}
      {regions.map((region, index) => (
        <motion.div
          key={region.name}
          className="absolute cursor-pointer"
          style={{
            left: `${region.coordinates.x}%`,
            top: `${region.coordinates.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ scale: 1.2 }}
          onClick={() => setSelectedRegion(region)}
        >
          <div className="relative">
            {/* Pulsing Ring */}
            <motion.div
              className={`absolute inset-0 rounded-full ${getSeverityColor(region.severity)} opacity-30`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ width: "24px", height: "24px", marginLeft: "-12px", marginTop: "-12px" }}
            />
            {/* Center Dot */}
            <div
              className={`relative rounded-full ${getSeverityColor(region.severity)} ${getSeveritySize(
                region.severity,
              )} border-2 border-white shadow-lg`}
            />
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
        <h4 className="text-white text-sm font-semibold mb-2">Outbreak Severity</h4>
        <div className="space-y-1">
          {[
            { level: "Critical", color: "bg-red-500", count: regions.filter((r) => r.severity === "critical").length },
            { level: "High", color: "bg-orange-500", count: regions.filter((r) => r.severity === "high").length },
            { level: "Medium", color: "bg-yellow-500", count: regions.filter((r) => r.severity === "medium").length },
            { level: "Low", color: "bg-green-500", count: regions.filter((r) => r.severity === "low").length },
          ].map((item) => (
            <div key={item.level} className="flex items-center space-x-2 text-xs">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-gray-300">{item.level}</span>
              <span className="text-gray-400">({item.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Region Details Popup */}
      {selectedRegion && (
        <motion.div
          className="absolute top-4 right-4 bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 border border-gray-700 min-w-[200px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">{selectedRegion.name}</h3>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Cases:</span>
              <span className="text-red-400 font-bold">{selectedRegion.cases.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recovered:</span>
              <span className="text-green-400 font-bold">{selectedRegion.recovered.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Deaths:</span>
              <span className="text-gray-300 font-bold">{selectedRegion.deaths}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Severity:</span>
              <span
                className={`font-bold capitalize ${getSeverityColor(selectedRegion.severity).replace("bg-", "text-")}`}
              >
                {selectedRegion.severity}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Day Counter */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
        <div className="text-white text-sm font-semibold">Day {currentDay}</div>
        <div className="text-gray-400 text-xs">Simulation Time</div>
      </div>
    </div>
  )
}
