import { ParsedExpense, Category } from './types'

export class APISystemError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'APISystemError'
  }
}

export class InvalidPromptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPromptError'
  }
}

export function validatePrompt(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim()
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt không được để trống' }
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Prompt quá ngắn, vui lòng mô tả chi tiết hơn' }
  }
  
  if (trimmed.length > 500) {
    return { valid: false, error: 'Prompt quá dài, vui lòng rút ngắn lại' }
  }
  
  return { valid: true }
}

export async function parseExpenseText(
  text: string, 
  categories: Category[] = [],
  retryCount = 0
): Promise<ParsedExpense> {
  throw new APISystemError('Gemini client disabled. Parsing is handled by backend.')
}

export async function parseExpenseWithAI(
  text: string,
  userName: string,
  categories: Category[] = []
): Promise<{ success: boolean; data?: ParsedExpense; error?: 'system' | 'invalid' }> {
  return { success: false, error: 'system' }
}
