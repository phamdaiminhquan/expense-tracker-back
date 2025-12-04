export interface Transaction {
  id: string
  userId: string
  userName: string
  spend: number | null
  earn: number | null
  content: string
  timestamp: number
  isPendingPrompt?: boolean
  originalPrompt?: string
  promptCreatedAt?: number
}

export interface ParsedExpense {
  spend: number | null
  earn: number | null
  content: string
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}
