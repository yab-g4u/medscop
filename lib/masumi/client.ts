// Masumi Blockchain Integration for Agent Wallets and DID Management
import { BlockFrostAPI } from "@blockfrost/blockfrost-js"

export interface MasumiAgent {
  id: string
  did: string
  walletAddress: string
  role: "policy" | "logistics" | "government" | "hospital" | "ngo" | "researcher"
  balance: number
  transactions: MasumiTransaction[]
  publicKey: string
  privateKey?: string // Only stored temporarily for demo purposes
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

export interface MasumiRegistry {
  registerAgent: (agentConfig: AgentConfig) => Promise<MasumiAgent>
  mintWallet: (agentId: string, initialFunding: number) => Promise<string>
  transferFunds: (from: string, to: string, amount: number, purpose: string) => Promise<MasumiTransaction>
  getAgentBalance: (walletAddress: string) => Promise<number>
  getTransactionHistory: (walletAddress: string) => Promise<MasumiTransaction[]>
  logDecision: (agentId: string, decision: string, impact: any) => Promise<string>
  getWalletInfo: (walletAddress: string) => Promise<any>
  createTestTransaction: (from: string, to: string, amount: number, purpose: string) => Promise<MasumiTransaction>
}

interface AgentConfig {
  role: string
  name: string
  initialFunding: number
  permissions: string[]
}

class MasumiClient implements MasumiRegistry {
  private baseUrl: string
  private apiKey: string
  private blockfrost: BlockFrostAPI
  private testWallets: Map<string, MasumiAgent> = new Map()

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MASUMI_API_URL || "https://api.masumi.network/testnet"
    this.apiKey = process.env.MASUMI_API_KEY || "test_key_placeholder"

    // Initialize Blockfrost for Cardano Preprod testnet
    this.blockfrost = new BlockFrostAPI({
      projectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || "preprodYourProjectIdHere",
      network: "preprod",
    })

    // Initialize test wallets for demo
    this.initializeTestWallets()
  }

  private initializeTestWallets() {
    // Government Agent Wallet
    const govAgent: MasumiAgent = {
      id: "gov_agent_001",
      did: "did:masumi:gov:1a2b3c4d5e6f",
      walletAddress: "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2f",
      role: "government",
      balance: 2500000, // 2.5M ADA
      transactions: [],
      publicKey: "ed25519_pk1abc123def456...",
      privateKey: "ed25519_sk1xyz789...", // Demo only
    }

    // NGO Agent Wallet
    const ngoAgent: MasumiAgent = {
      id: "ngo_agent_001",
      did: "did:masumi:ngo:2b3c4d5e6f7g",
      walletAddress: "addr_test1qr3gx8va4myzf6kqs4kkl3aimkrp2r76s9nskgmprpemy6njubes99c4wpq7k",
      role: "ngo",
      balance: 1800000, // 1.8M ADA
      transactions: [],
      publicKey: "ed25519_pk2def456ghi789...",
      privateKey: "ed25519_sk2abc123...", // Demo only
    }

    // Hospital Agent Wallet
    const hospitalAgent: MasumiAgent = {
      id: "hospital_agent_001",
      did: "did:masumi:hospital:3c4d5e6f7g8h",
      walletAddress: "addr_test1qp2rshxmyq04kwd998h0ke83a7669l6whg6ajayp4l42kbkjubes99c4wpq7k",
      role: "hospital",
      balance: 950000, // 950K ADA
      transactions: [],
      publicKey: "ed25519_pk3ghi789jkl012...",
      privateKey: "ed25519_sk3def456...", // Demo only
    }

    // Researcher Agent Wallet
    const researcherAgent: MasumiAgent = {
      id: "researcher_agent_001",
      did: "did:masumi:researcher:4d5e6f7g8h9i",
      walletAddress: "addr_test1qz8f2qx4yjdp2a0rjr4r5krp0de7lo9r6y3jdp0dp62s63njubes99c4wpq7k",
      role: "researcher",
      balance: 750000, // 750K ADA
      transactions: [],
      publicKey: "ed25519_pk4jkl012mno345...",
      privateKey: "ed25519_sk4ghi789...", // Demo only
    }

    this.testWallets.set(govAgent.walletAddress, govAgent)
    this.testWallets.set(ngoAgent.walletAddress, ngoAgent)
    this.testWallets.set(hospitalAgent.walletAddress, hospitalAgent)
    this.testWallets.set(researcherAgent.walletAddress, researcherAgent)
  }

  async registerAgent(agentConfig: AgentConfig): Promise<MasumiAgent> {
    try {
      // Generate a new wallet address for the agent
      const walletAddress = this.generateTestWalletAddress()

      const agent: MasumiAgent = {
        id: `agent_${Date.now()}`,
        did: `did:masumi:${agentConfig.role}:${Math.random().toString(36).substr(2, 12)}`,
        walletAddress,
        role: agentConfig.role as any,
        balance: agentConfig.initialFunding,
        transactions: [],
        publicKey: `ed25519_pk${Math.random().toString(36).substr(2, 20)}`,
        privateKey: `ed25519_sk${Math.random().toString(36).substr(2, 20)}`,
      }

      // Store in our test registry
      this.testWallets.set(walletAddress, agent)

      console.log(`🔗 Masumi: Registered agent ${agentConfig.name} with DID: ${agent.did}`)
      console.log(`💰 Wallet Address: ${agent.walletAddress}`)
      console.log(`💎 Initial Balance: ₳${agent.balance.toLocaleString()}`)

      return agent
    } catch (error) {
      console.error("Failed to register agent:", error)
      throw new Error("Agent registration failed")
    }
  }

  async mintWallet(agentId: string, initialFunding: number): Promise<string> {
    try {
      const walletAddress = this.generateTestWalletAddress()

      // In a real implementation, this would create an actual Cardano wallet
      console.log(`💰 Masumi: Minted wallet ${walletAddress} with ₳${initialFunding.toLocaleString()}`)

      return walletAddress
    } catch (error) {
      console.error("Failed to mint wallet:", error)
      throw new Error("Wallet minting failed")
    }
  }

  async transferFunds(from: string, to: string, amount: number, purpose: string): Promise<MasumiTransaction> {
    try {
      const fromAgent = this.testWallets.get(from)
      const toAgent = this.testWallets.get(to)

      if (!fromAgent) {
        throw new Error(`Source wallet ${from} not found`)
      }

      if (fromAgent.balance < amount) {
        throw new Error(`Insufficient funds. Available: ₳${fromAgent.balance}, Required: ₳${amount}`)
      }

      // Create transaction
      const transaction: MasumiTransaction = {
        id: `tx_${Date.now()}`,
        txHash: `tx_${Math.random().toString(36).substr(2, 16)}`,
        from,
        to,
        amount,
        purpose,
        timestamp: new Date(),
        blockHash: `block_${Math.random().toString(36).substr(2, 16)}`,
        blockHeight: Math.floor(Math.random() * 1000000) + 8000000,
        status: "pending",
        fees: Math.floor(amount * 0.0017), // ~0.17% fee
      }

      // Update balances
      fromAgent.balance -= amount + transaction.fees
      if (toAgent) {
        toAgent.balance += amount
      }

      // Add to transaction history
      fromAgent.transactions.push(transaction)
      if (toAgent) {
        toAgent.transactions.push(transaction)
      }

      // Simulate blockchain confirmation
      setTimeout(() => {
        transaction.status = "confirmed"
        console.log(`✅ Masumi: Transaction confirmed - ${purpose}: ₳${amount.toLocaleString()}`)
        console.log(`🔗 TX Hash: ${transaction.txHash}`)
        console.log(`📊 Block Height: ${transaction.blockHeight}`)
      }, 2000)

      console.log(`🚀 Masumi: Transaction initiated - ${purpose}`)
      console.log(`💸 Amount: ₳${amount.toLocaleString()} (+ ₳${transaction.fees} fees)`)
      console.log(`📤 From: ${from.substring(0, 20)}...`)
      console.log(`📥 To: ${to.substring(0, 20)}...`)

      return transaction
    } catch (error) {
      console.error("Transfer failed:", error)
      throw error
    }
  }

  async getAgentBalance(walletAddress: string): Promise<number> {
    try {
      const agent = this.testWallets.get(walletAddress)
      if (agent) {
        return agent.balance
      }

      // Try to fetch from Blockfrost for real addresses
      try {
        const addressInfo = await this.blockfrost.addresses(walletAddress)
        return Number.parseInt(addressInfo.amount[0]?.quantity || "0") / 1000000 // Convert lovelace to ADA
      } catch (blockfrostError) {
        console.warn("Blockfrost lookup failed, using test data")
        return Math.floor(Math.random() * 1000000) + 100000
      }
    } catch (error) {
      console.error("Failed to get balance:", error)
      return 0
    }
  }

  async getTransactionHistory(walletAddress: string): Promise<MasumiTransaction[]> {
    try {
      const agent = this.testWallets.get(walletAddress)
      if (agent) {
        return agent.transactions
      }

      // Return mock transaction history for demo
      return [
        {
          id: "tx_001",
          txHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
          from: "WHO_Emergency_Fund",
          to: walletAddress,
          amount: 500000,
          purpose: "Initial emergency funding allocation",
          timestamp: new Date(Date.now() - 86400000),
          blockHash: "block_abc123def456",
          blockHeight: 8234567,
          status: "confirmed",
          fees: 850,
        },
        {
          id: "tx_002",
          txHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
          from: walletAddress,
          to: "Lagos_General_Hospital",
          amount: 75000,
          purpose: "Medical equipment procurement",
          timestamp: new Date(Date.now() - 43200000),
          blockHash: "block_def456ghi789",
          blockHeight: 8234789,
          status: "confirmed",
          fees: 127,
        },
      ]
    } catch (error) {
      console.error("Failed to get transaction history:", error)
      return []
    }
  }

  async logDecision(agentId: string, decision: string, impact: any): Promise<string> {
    try {
      const logHash = `log_${Math.random().toString(36).substr(2, 16)}`
      const timestamp = new Date().toISOString()

      // In a real implementation, this would be stored on-chain
      console.log(`📝 Masumi: Decision logged for ${agentId}`)
      console.log(`🎯 Decision: ${decision}`)
      console.log(`📊 Impact: ${JSON.stringify(impact)}`)
      console.log(`🔗 Log Hash: ${logHash}`)
      console.log(`⏰ Timestamp: ${timestamp}`)

      return logHash
    } catch (error) {
      console.error("Failed to log decision:", error)
      throw new Error("Decision logging failed")
    }
  }

  async getWalletInfo(walletAddress: string): Promise<any> {
    try {
      const agent = this.testWallets.get(walletAddress)
      if (agent) {
        return {
          address: agent.walletAddress,
          balance: agent.balance,
          role: agent.role,
          did: agent.did,
          transactionCount: agent.transactions.length,
          lastActivity:
            agent.transactions.length > 0 ? agent.transactions[agent.transactions.length - 1].timestamp : new Date(),
        }
      }

      // Try Blockfrost for real addresses
      try {
        const addressInfo = await this.blockfrost.addresses(walletAddress)
        return {
          address: walletAddress,
          balance: Number.parseInt(addressInfo.amount[0]?.quantity || "0") / 1000000,
          transactionCount: addressInfo.tx_count,
          lastActivity: new Date(),
        }
      } catch (blockfrostError) {
        throw new Error("Wallet not found")
      }
    } catch (error) {
      console.error("Failed to get wallet info:", error)
      throw error
    }
  }

  async createTestTransaction(from: string, to: string, amount: number, purpose: string): Promise<MasumiTransaction> {
    return this.transferFunds(from, to, amount, purpose)
  }

  private generateTestWalletAddress(): string {
    // Generate a realistic-looking Cardano testnet address
    const prefix = "addr_test1"
    const randomPart = Math.random().toString(36).substr(2, 50)
    return `${prefix}q${randomPart}`
  }

  // Get all test wallets for demo purposes
  getAllTestWallets(): MasumiAgent[] {
    return Array.from(this.testWallets.values())
  }

  // Get wallet by role
  getWalletByRole(role: string): MasumiAgent | undefined {
    return Array.from(this.testWallets.values()).find((agent) => agent.role === role)
  }
}

export const masumiClient = new MasumiClient()

// Export test wallet addresses for easy access
export const TEST_WALLETS = {
  GOVERNMENT: "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2f",
  NGO: "addr_test1qr3gx8va4myzf6kqs4kkl3aimkrp2r76s9nskgmprpemy6njubes99c4wpq7k",
  HOSPITAL: "addr_test1qp2rshxmyq04kwd998h0ke83a7669l6whg6ajayp4l42kbkjubes99c4wpq7k",
  RESEARCHER: "addr_test1qz8f2qx4yjdp2a0rjr4r5krp0de7lo9r6y3jdp0dp62s63njubes99c4wpq7k",
}
