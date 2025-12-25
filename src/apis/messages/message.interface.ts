import { PageOptionsDto } from '@/common/interfaces/api.interface'
import { MessageStatus, FundType } from '@/lib/types'
import { Message } from './message.entities'

export type CategoryParentDto = {
  id: string
  name: string
  description?: string | null
  createdAt?: string | number
}

export type CategoryDto = {
  id: string
  name: string
  description?: string | null
  fundId?: string | null
  parent?: CategoryParentDto | null
  createdAt?: string | number
}

export type TransactionDto = {
  id: string
  spendValue?: number | null
  earnValue?: number | null
  content?: string | null
  categoryId?: string | null
  category?: CategoryDto | null
  createdAt?: string | number
  updatedAt?: string | number
}

export type FundDto = {
  id: string
  name: string
  type: FundType
  ownerId?: string | null
  memberIds?: string[] | null
  createdAt?: string | number
}

export type MessageDto = {
  id: string
  fundId: string
  message?: string | null
  spendValue?: number | null
  earnValue?: number | null
  categoryId?: string | null
  status?: MessageStatus
  metadata?: Record<string, unknown> | null
  transactionId?: string | null
  createdAt?: string | number
  createdById?: string | null
  createdByName?: string | null
  updatedAt?: string | number
  // Relations
  fund?: FundDto | null
  transaction?: TransactionDto | null
}

export type CreateMessagePayload = {
  message: string | null,
  spendValue?: number | null
  earnValue?: number | null
  categoryId?: string | null
}

export type UpdateMessagePayload = {
  message?: string | null
}

export interface GetListMessagesDto extends PageOptionsDto<Message>  {}

export interface CreateMessageDto {
  message: string | null
  spendValue?: number | null
  earnValue?: number | null
  categoryId?: string | null
}

export interface UpdateMessageDto {
  message?: string | null
  spendValue?: number | null
  earnValue?: number | null
  categoryId?: string | null
}