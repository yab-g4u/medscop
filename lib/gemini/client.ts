"use client"

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

interface AgentPromptData {
  infection_rate?: number
  vaccination_rate?: number
  response_delay_days?: number
  population_size?: number
  disease_name?: string
  region_name?: string
  infection_count?: number
  available_beds?: number
  available_medics?: number
  medicine_level?: number
  funding?: number
  policy_delay?: number
  r0_value?: number
  active_cases?: number
  fatality_rate?: number
  region?: string
  sentiment_score?: number
  distrust_percentage?: number
  compliance_level?: number
  gov_wallet?: number
  ngo_wallet?: number
  urgency_score?: number
  regional_needs_summary?: string
}

class GeminiClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyA52lo213Lf3Zg7sNe1FEPRjdCE8ygPavw"
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models"
  }

  private replaceTemplateVariables(template: string, data: AgentPromptData): string {
    let prompt = template
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      prompt = prompt.replace(new RegExp(placeholder, "g"), String(value))
    })
    return prompt
  }

  /*async queryGeminiAgent(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data: GeminiResponse = await response.json()

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text
      }

      throw new Error("No response from Gemini")
    } catch (error) {
      console.error("Gemini API Error:", error)
      throw error
    }
  }*/

  async getPolicyAdvisorResponse(data: AgentPromptData): Promise<string> {
    const template = `You are a government public health policy advisor. A disease is spreading with the following parameters:
• Infection rate: {{infection_rate}}%
• Vaccination coverage: {{vaccination_rate}}%
• Government response delay: {{response_delay_days}} days
• Population size: {{population_size}}
• Disease: {{disease_name}}

Based on this data, what public health actions should we take immediately to reduce transmission and prevent fatalities? Be specific, concise, and action-oriented.`

    const prompt = this.replaceTemplateVariables(template, data)
    return await queryGeminiAgent(prompt)
  }

  async getLogisticsResponse(data: AgentPromptData): Promise<string> {
    const template = `You are a logistics agent during an active outbreak in Region {{region_name}}.
Here are the latest figures:
• Total infections: {{infection_count}}
• Available hospital beds: {{available_beds}}
• Medical staff: {{available_medics}}
• Medicine stock level: {{medicine_level}}%
• Available funding: {{funding}} ADA

What is the most effective way to distribute resources? Prioritize based on urgency, severity, and potential health impact.`

    const prompt = this.replaceTemplateVariables(template, data)
    return await queryGeminiAgent(prompt)
  }

  async getGovernmentResponse(data: AgentPromptData): Promise<string> {
    const template = `You are simulating a government response during an epidemic. The current policy (e.g., lockdown or funding) has been delayed by {{policy_delay}} days.
• Disease R₀: {{r0_value}}
• Current active cases: {{active_cases}}
• Fatality rate: {{fatality_rate}}%

What is the projected impact of this delay, and what decisions must be made now to minimize harm?`

    const prompt = this.replaceTemplateVariables(template, data)
    return await queryGeminiAgent(prompt)
  }

  async getPublicSentimentResponse(data: AgentPromptData): Promise<string> {
    const template = `You are monitoring public sentiment during a pandemic in Region {{region}}.
• Sentiment index: {{sentiment_score}}/10
• Vaccine distrust rate: {{distrust_percentage}}%
• Public compliance: {{compliance_level}}%

Suggest strategies (communication or community engagement) to improve vaccine acceptance and policy trust in this region.`

    const prompt = this.replaceTemplateVariables(template, data)
    return await queryGeminiAgent(prompt)
  }

  async getFundingEvaluatorResponse(data: AgentPromptData): Promise<string> {
    const template = `You are advising a blockchain-based funding distribution system using Masumi testnet.
• Government wallet: {{gov_wallet}} ADA
• NGO wallet: {{ngo_wallet}} ADA
• Urgency level: {{urgency_score}}/10
• Top 3 regional needs: {{regional_needs_summary}}

How should the simulation allocate funding efficiently to maximize medical impact and policy success?`

    const prompt = this.replaceTemplateVariables(template, data)
    return await queryGeminiAgent(prompt)
  }
}

export const geminiClient = new GeminiClient()

export async function queryGeminiAgent(prompt: string, model?: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, model }),
  })

  if (!res.ok) {
    throw new Error(`Gemini route error ${res.status}`)
  }

  const data: { text: string } = await res.json()
  return data.text
}
