import { createContext, useContext, useState } from 'react'
import { Category, ParsedExpense } from '@/lib/types'

interface AIParserContextValue {
  isParsing: boolean
  parseExpense: (
    text: string,
    userName: string,
    categories?: Category[]
  ) => Promise<{ success: boolean; data?: ParsedExpense; error?: 'system' | 'invalid' }>
}

const AIParserContext = createContext<AIParserContextValue | null>(null)

function useAIParserState(): AIParserContextValue {
  const [isParsing, setIsParsing] = useState(false)

  const parseExpense = async (
    text: string,
    userName: string,
    categories: Category[] = []
  ): Promise<{ success: boolean; data?: ParsedExpense; error?: 'system' | 'invalid' }> => {
    // Gemini client bị tắt; backend xử lý parsing nếu cần.
    return { success: false, error: 'system' }
  }

  return { isParsing, parseExpense }
}

export function AIParserProvider({ children }: { children: React.ReactNode }) {
  const value = useAIParserState()
  return <AIParserContext.Provider value={value}>{children}</AIParserContext.Provider>
}

export function useAIParser(): AIParserContextValue {
  const ctx = useContext(AIParserContext)
  if (!ctx) {
    throw new Error('useAIParser must be used within AIParserProvider')
  }
  return ctx
}

export { AIParserContext }
