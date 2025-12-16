import { MessageStatus } from '@/lib/types'

export type MessageDto = {
  id: string
  fundId: string
  message?: string | null
  spendValue?: number | null
  earnValue?: number | null
  categoryId?: string | null
  status?: MessageStatus
  metadata?: Record<string, unknown> | null
  createdAt?: string | number
  createdById?: string | null
  createdByName?: string | null
  updatedAt?: string | number
}

export type CreateMessagePayload = {
  message: string | null,
  spendValue?: number | null
  earnValue?: number | null
  categoryId?: string | null
}

export type UpdateMessagePayload = {
  spendValue?: number | null
  earnValue?: number | null
  message?: string | null
  categoryId?: string | null
  status?: MessageStatus
}
