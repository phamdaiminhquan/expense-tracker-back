import { useMessages as useMessagesFromProvider, MessageProvider } from '@/app/providers/MessageProvider'

export function useMessages() {
  return useMessagesFromProvider()
}

export { MessageProvider }
