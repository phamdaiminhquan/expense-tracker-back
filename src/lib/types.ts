export interface Transaction {
  id: string
  user: string
  spend: number | null
  earn: number | null
  content: string
  timestamp: number
}

export interface ParsedExpense {
  user: string
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
