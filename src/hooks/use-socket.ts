import { useSocket as useSocketFromProvider } from '@/app/providers/SocketProvider'

export function useSocket() {
  return useSocketFromProvider()
}
