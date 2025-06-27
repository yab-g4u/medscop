"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Wallet, TrendingUp, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  purpose: string
  status: "pending" | "confirmed" | "failed"
  timestamp: Date
  txHash: string
}

interface WalletBalance {
  name: string
  role: string
  address: string
  balance: number
  allocated: number
  spent: number
  color: string
}

export default function FundingTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      from: "WHO Emergency Fund",
      to: "Government Agent",
      amount: 200000,
      purpose: "Initial policy coordination funding",
      status: "confirmed",
      timestamp: new Date(Date.now() - 3600000),
      txHash: "tx_abc123def456",
    },
    {
      id: "2",
      from: "Government Agent",
      to: "Lagos General Hospital",
      amount: 75000,
      purpose: "Emergency medical equipment",
      status: "confirmed",
      timestamp: new Date(Date.now() - 1800000),
      txHash: "tx_def456ghi789",
    },
    {
      id: "3",
      from: "Gates Foundation",
      to: "NGO Network",
      amount: 150000,
      purpose: "Community health worker deployment",
      status: "pending",
      timestamp: new Date(Date.now() - 900000),
      txHash: "tx_ghi789jkl012",
    },
  ])

  const [wallets] = useState<WalletBalance[]>([
    {
      name: "Government Agent",
      role: "Policy & Coordination",
      address: "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2f",
      balance: 125000,
      allocated: 200000,
      spent: 75000,
      color: "blue",
    },
    {
      name: "NGO Network",
      role: "Community Outreach",
      address: "addr_test1qr3gx8va4myzf6kqs4kkl3aimkrp2r76s9nskgmprpemy6njubes99c4wpq7k",
      balance: 87250,
      allocated: 150000,
      spent: 62750,
      color: "green",
    },
    {
      name: "Hospital Network",
      role: "Medical Resources",
      address: "addr_test1qp2rshxmyq04kwd998h0ke83a7669l6whg6ajayp4l42kbkjubes99c4wpq7k",
      balance: 67750,
      allocated: 100000,
      spent: 32250,
      color: "purple",
    },
  ])

  const totalAllocated = wallets.reduce((sum, wallet) => sum + wallet.allocated, 0)
  const totalSpent = wallets.reduce((sum, wallet) => sum + wallet.spent, 0)
  const totalRemaining = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-900/20 text-green-300 border-green-500/30"
      case "pending":
        return "bg-yellow-900/20 text-yellow-300 border-yellow-500/30"
      case "failed":
        return "bg-red-900/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-900/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Allocated</p>
                <p className="text-2xl font-bold text-blue-400">₳ {totalAllocated.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Across all agents</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-green-400">₳ {totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{((totalSpent / totalAllocated) * 100).toFixed(1)}% utilized</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Remaining</p>
                <p className="text-2xl font-bold text-purple-400">₳ {totalRemaining.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((totalRemaining / totalAllocated) * 100).toFixed(1)}% available
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Balances */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Agent Wallet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.address}
                className="p-4 bg-gray-700 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 bg-${wallet.color}-400 rounded-full`} />
                    <div>
                      <h3 className="text-white font-semibold">{wallet.name}</h3>
                      <p className="text-gray-400 text-sm">{wallet.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">₳ {wallet.balance.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Available</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Utilization</span>
                    <span className="text-white">{((wallet.spent / wallet.allocated) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(wallet.spent / wallet.allocated) * 100} className="h-2" />
                </div>

                <div className="mt-3 text-xs text-gray-500 font-mono">
                  {wallet.address.substring(0, 20)}...{wallet.address.substring(wallet.address.length - 10)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(tx.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{tx.from}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium">{tx.to}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{tx.purpose}</p>
                    <p className="text-gray-500 text-xs font-mono">{tx.txHash}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">₳ {tx.amount.toLocaleString()}</p>
                  <Badge variant="secondary" className={getStatusColor(tx.status)}>
                    {tx.status}
                  </Badge>
                  <p className="text-gray-500 text-xs mt-1">{tx.timestamp.toLocaleTimeString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
