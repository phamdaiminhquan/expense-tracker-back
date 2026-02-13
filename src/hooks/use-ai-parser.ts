import { useAIParser as useAIParserFromProvider, AIParserProvider } from '@/app/providers/AIParserProvider'

export function useAIParser() {
  return useAIParserFromProvider()
}

export { AIParserProvider }
