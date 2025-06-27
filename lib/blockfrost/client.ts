class BlockfrostClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = "mainnetRA7RJTrYATicRVxon3cJyqJwQizk4pMq"
    this.baseUrl = "https://cardano-mainnet.blockfrost.io/api/v0"
  }

  private async request(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        project_id: this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getLatestBlock() {
    return this.request("/blocks/latest")
  }

  async getGenesis() {
    return this.request("/genesis")
  }

  async getMetadataLabels() {
    return this.request("/metadata/txs/labels")
  }
}

export const blockfrostClient = new BlockfrostClient()
