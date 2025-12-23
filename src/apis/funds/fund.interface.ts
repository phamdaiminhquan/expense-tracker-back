import { FundType } from '@/lib/types'

export type FundLastMessageDto = {
  id: string
  message: string | null
  createdAt: string // ISO 8601
  processedAt: string | null // ISO 8601
}

export type FundDto = {
  id: string
  name: string
  type: FundType
  ownerId: string
  numberId: string | null
  description: string | null
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
  memberIds?: string[]
  lastMessage: FundLastMessageDto | null // Message mới nhất từ BE (đã được sort)
}

export interface FundsListResponse {
  data: FundDto[]
  total: number
}

export interface FundsListQuery {
  page?: number
  take?: number
  orderBy?: string
  orderType?: 'ASC' | 'DESC'
  search?: string
}

export type FundMemberDto = {
  id: string
  fundId: string
  userId: string
  role: 'owner' | 'member'
  user?: {
    id: string
    email: string
    name: string
  }
}

export interface CreateFundPayload {
  name: string
  type: FundType
  memberIds?: string[]
}

export interface UpdateFundPayload {
  name?: string
  type?: FundType
  memberIds?: string[]
}

export interface AddMemberPayload {
  userId: string
  role: 'owner' | 'member'
}
