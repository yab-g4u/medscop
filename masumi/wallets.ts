import { MasumiAgent } from "./types"
import { generateRandomAddress } from "./shim"

export function createTestAgent(role: string, initialFunding: number): MasumiAgent {
  return {
    id: `agent_${Date.now()}`,
    did: `did:masumi:${role}:${Math.random().toString(36).substring(2, 8)}`,
    walletAddress: generateRandomAddress(),
    role: role as MasumiAgent["role"],
    balance: initialFunding,
    transactions: [],
    publicKey: `ed25519_pk_${Math.random().toString(36).substring(2, 24)}`,
    privateKey: `ed25519_sk_${Math.random().toString(36).substring(2, 24)}`
  }
}

export const DEFAULT_ROLES = ["government", "ngo", "hospital", "researcher"]

