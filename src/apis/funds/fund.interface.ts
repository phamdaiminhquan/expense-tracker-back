import { FundType } from '@/lib/types'

export type FundDto = {
  id: string
  name: string
  type: FundType
  ownerId: string
  createdAt: string | number
  updatedAt?: string | number
  memberIds?: string[]
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
