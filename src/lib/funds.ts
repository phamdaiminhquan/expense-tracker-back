import { Fund, FundType } from './types'

export function createDefaultPersonalFund(userId: string, userName: string): Fund {
  return {
    id: `fund_personal_${userId}`,
    name: 'Cá nhân',
    type: 'personal',
    ownerId: userId,
    memberIds: [userId],
    createdAt: Date.now(),
  }
}

export function createFund(
  name: string,
  type: FundType,
  ownerId: string,
  memberIds: string[]
): Fund {
  return {
    id: `fund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    ownerId,
    memberIds,
    createdAt: Date.now(),
  }
}

export function canAccessFund(fund: Fund, userId: string): boolean {
  // Owner luôn có quyền truy cập
  if (fund.ownerId === userId) return true
  // Check memberIds
  return fund.memberIds.includes(userId)
}

export function canEditFund(fund: Fund, userId: string): boolean {
  return fund.ownerId === userId
}
