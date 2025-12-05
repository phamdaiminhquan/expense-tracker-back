export type FundType = 'personal' | 'shared'

export interface Category {
  id: string
  fundId: string
  name: string
  description: string
  createdAt: number
}

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
  categoryId?: string | null
  timestamp: number
  isPendingPrompt?: boolean
  originalPrompt?: string
  promptCreatedAt?: number
}

export interface ParsedExpense {
  spend: number | null
  earn: number | null
  content: string
  categoryId?: string | null
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
