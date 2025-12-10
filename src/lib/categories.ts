import { Category } from './types'

export function createCategory(
  fundId: string,
  name: string,
  description: string
): Category {
  return {
    id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fundId,
    name,
    description,
    createdAt: Date.now(),
  }
}

export function canDeleteCategory(categoryId: string, transactions: any[]): boolean {
  return !transactions.some((t) => t.categoryId === categoryId)
}
