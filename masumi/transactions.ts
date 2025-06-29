import { MasumiTransaction } from "./types"

export function createTransaction(from: string, to: string, amount: number, purpose: string): MasumiTransaction {
  return {
    id: `tx_${Date.now()}`,
    txHash: `tx_${Math.random().toString(36).substring(2, 20)}`,
    from,
    to,
    amount,
    purpose,
    timestamp: new Date(),
    blockHash: `block_${Math.random().toString(36).substring(2, 16)}`,
    blockHeight: Math.floor(Math.random() * 1000000) + 8000000,
    status: "pending",
    fees: Math.floor(amount * 0.0017),
  }
}

export function confirmTransaction(tx: MasumiTransaction) {
  tx.status = "confirmed"
  return tx
}

