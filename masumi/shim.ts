// Shim fallback for testing/demo environments

export function generateRandomAddress(): string {
  return `addr_test1q${Math.random().toString(36).substring(2, 40)}`
}

export function simulateDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

