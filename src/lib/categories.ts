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

export function canDeleteCategory(categoryId: string, messages: any[]): boolean {
  return !messages.some((t) => t.categoryId === categoryId)
}
