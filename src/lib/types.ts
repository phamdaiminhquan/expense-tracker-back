export type FundType = 'personal' | 'shared'

export interface Fund {
  id: string
  name: string
  type: FundType
  ownerId: string
  memberIds: string[]
  createdAt: number
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  fundId: string
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
