import { Fund, FundType } from "./types.lib";

export function createDefaultPersonalFund(
  userId: string,
  userName: string
): Fund {
  return {
    id: `fund_personal_${userId}`,
    name: "Cá nhân",
    type: "personal",
    ownerId: userId,
    memberIds: [userId],
    createdAt: Date.now(),
  };
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
  };
}

export function canAccessFund(fund: Fund, userId: string): boolean {
  // Ưu tiên check canAccess từ BE nếu có
  if (fund.canAccess !== undefined) return fund.canAccess;
  // Fallback check memberIds
  return fund.ownerId === userId || fund.memberIds.includes(userId);
}

export function canEditFund(fund: Fund, userId: string): boolean {
  // Ưu tiên check membershipRole từ BE nếu có
  if (fund.membershipRole !== undefined) return fund.membershipRole === "owner";
  // Fallback check ownerId
  return fund.ownerId === userId;
}
