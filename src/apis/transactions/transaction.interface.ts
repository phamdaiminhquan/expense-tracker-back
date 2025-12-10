import { TransactionStatus } from '@/lib/types'

export type TransactionDto = {
  id: string
  fundId: string
  rawPrompt?: string | null
  spendValue?: number | null
  earnValue?: number | null
  content?: string | null
  categoryId?: string | null
  status?: TransactionStatus
  metadata?: Record<string, unknown> | null
  createdAt?: string | number
  createdById?: string | null
  createdByName?: string | null
  updatedAt?: string | number
}

export type CreateTransactionPayload = {
  rawPrompt: string
  spendValue?: number | null
  earnValue?: number | null
  content?: string | null
  categoryId?: string | null
}

export type UpdateTransactionPayload = {
  spendValue?: number | null
  earnValue?: number | null
  content?: string | null
  categoryId?: string | null
  status?: TransactionStatus
}
