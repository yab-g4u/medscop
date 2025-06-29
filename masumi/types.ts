export interface MasumiAgent {
  id: string
  did: string
  walletAddress: string
  role: "policy" | "logistics" | "government" | "hospital" | "ngo" | "researcher"
  balance: number
  transactions: MasumiTransaction[]
  publicKey: string
  privateKey?: string
}

export interface MasumiTransaction {
  id: string
  txHash: string
  from: string
  to: string
  amount: number
  purpose: string
  timestamp: Date
  blockHash: string
  blockHeight: number
  status: "pending" | "confirmed" | "failed"
  fees: number
}

export interface AgentConfig {
  role: string
  name: string
  initialFunding: number
  permissions: string[]
}
