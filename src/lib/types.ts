import { TransactionDto } from "@/apis/messages/message.interface"

export type FundType = 'personal' | 'shared'

export type MessageStatus = 'pending' | 'processed' | 'failed'

export interface Category {
  id: string
  fundId: string
  name: string
  description: string
  createdAt: number
}

export interface FundLastMessage {
  id: string
  text: string
  timestamp: number
  processedAt?: number | null
}

export interface Fund {
  id: string
  name: string
  type: FundType
  ownerId: string
  memberIds: string[]
  createdAt: number
  lastMessage?: FundLastMessage  // Message mới nhất từ BE
  isOpenDialogCate?: boolean
}

export interface Message {
  id: string
  createdById: string
  userName: string
  fundId: string
  spend: number | null
  earn: number | null
  message: string
  categoryId?: string | null
  categoryName?: string | null
  timestamp: number

  status?: MessageStatus
  isPendingPrompt?: boolean
  originalPrompt?: string
  createdAt: number
  clientStatus?: 'sending' | 'sent' | 'failed'
  clientTempId?: string
  transaction?: TransactionDto
}

export interface ParsedExpense {
  spend: number | null
  earn: number | null
  message: string
  categoryId?: string | null
}

export interface GeminiResponse {
  candidates?: Array<{
    message?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}
