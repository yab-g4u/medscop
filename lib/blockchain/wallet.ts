// lightweight fetch-based client (no Node core modules)
import { blockfrostClient } from "@/lib/blockfrost/client"

export async function getLatestBlock() {
  try {
    const latest = await blockfrostClient.getLatestBlock()
    return latest
  } catch (error) {
    console.error("Error fetching latest block:", error)
    return null
  }
}

export async function getAddressDetails(address: string) {
  try {
    const addressDetails = await blockfrostClient.getAddressDetails(address)
    return addressDetails
  } catch (error) {
    console.error(`Error fetching details for address ${address}:`, error)
    return null
  }
}

export async function getAddressTransactions(address: string) {
  try {
    const addressTransactions = await blockfrostClient.getAddressTransactions(address)
    return addressTransactions
  } catch (error) {
    console.error(`Error fetching transactions for address ${address}:`, error)
    return null
  }
}
