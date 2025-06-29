import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { MasumiAgent, MasumiTransaction, AgentConfig } from "./types"
import { generateRandomAddress, simulateDelay } from "./shim"
import { createTransaction, confirmTransaction } from "./transactions"

class MasumiClient {
  private blockfrost: BlockFrostAPI
  private testWallets = new Map<string, MasumiAgent>()

  constructor() {
    this.blockfrost = new BlockFrostAPI({
      projectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID!,
      network: "preprod",
    })

    this.initializeTestAgents()
  }

  private initializeTestAgents() {
    const roles: AgentConfig[] = [
      { role: "government", name: "Gov Agent", initialFunding: 2500000, permissions: [] },
      { role: "ngo", name: "NGO Agent", initialFunding: 1800000, permissions: [] },
      { role: "hospital", name: "Hospital Agent", initialFunding: 950000, permissions: [] },
      { role: "researcher", name: "Researcher Agent", initialFunding: 750000, permissions: [] },
    ]

    roles.forEach(cfg => {
      const agent = this.registerAgentSync(cfg)
      this.testWallets.set(agent.walletAddress, agent)
    })
  }

  private registerAgentSync(config: AgentConfig): MasumiAgent {
    const walletAddress = generateRandomAddress()
    return {
      id: `agent_${Date.now()}`,
      did: `did:masumi:${config.role}:${Math.random().toString(36).substr(2, 12)}`,
      walletAddress,
      role: config.role as MasumiAgent["role"],
      balance: config.initialFunding,
      transactions: [],
      publicKey: `ed25519_pk${Math.random().toString(36).substr(2, 20)}`,
      privateKey: `ed25519_sk${Math.random().toString(36).substr(2, 20)}`
    }
  }

  async registerAgent(config: AgentConfig): Promise<MasumiAgent> {
    const agent = this.registerAgentSync(config)
    this.testWallets.set(agent.walletAddress, agent)
    return agent
  }

  async transferFunds(from: string, to: string, amount: number, purpose: string): Promise<MasumiTransaction> {
    const sender = this.testWallets.get(from)
    const receiver = this.testWallets.get(to)

    if (!sender || sender.balance < amount) throw new Error("Insufficient funds or wallet not found")

    const tx = createTransaction(from, to, amount, purpose)
    sender.balance -= amount + tx.fees
    if (receiver) receiver.balance += amount

    sender.transactions.push(tx)
    if (receiver) receiver.transactions.push(tx)

    await simulateDelay(1000)
    confirmTransaction(tx)

    return tx
  }

  async getAgentBalance(address: string): Promise<number> {
    const agent = this.testWallets.get(address)
    return agent ? agent.balance : 0
  }

  async getTransactionHistory(address: string): Promise<MasumiTransaction[]> {
    return this.testWallets.get(address)?.transactions || []
  }

  getWalletByRole(role: string): MasumiAgent | undefined {
    return [...this.testWallets.values()].find(a => a.role === role)
  }

  getAllTestWallets(): MasumiAgent[] {
    return [...this.testWallets.values()]
  }
}

export const masumiClient = new MasumiClient()

