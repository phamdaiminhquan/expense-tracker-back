/**
 * useSocketFundEvents — Lắng nghe fund/member events từ WebSocket
 *
 * Hook này lắng nghe:
 * - fund:updated → mutate fund list + fund detail SWR cache
 * - member:joined → toast thông báo + mutate members
 * - member:left → toast thông báo + mutate members
 *
 * Sử dụng ở cấp route/page nơi cần cập nhật sidebar hoặc fund data.
 *
 * @example
 *   useSocketFundEvents({ currentUserId, mutateFundList })
 */

import { useEffect, useRef } from 'react'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { useSocket } from '@/hooks/use-socket'
import { SocketEvent } from '@/common/lib/socket.lib'

interface MemberEventPayload {
  fundId: string
  userId: string
  userName?: string
  role?: string
  actionBy?: string
}

interface FundEventPayload {
  fundId: string
  data?: Record<string, unknown>
}

interface UseSocketFundEventsOptions {
  /** ID user hiện tại */
  currentUserId: string | null
  /** Mutate hàm refresh fund list SWR cache */
  mutateFundList?: () => void
}

export function useSocketFundEvents({
  currentUserId,
  mutateFundList,
}: UseSocketFundEventsOptions): void {
  const { socket, isConnected } = useSocket()
  const currentUserIdRef = useRef(currentUserId)
  const mutateFundListRef = useRef(mutateFundList)

  useEffect(() => { currentUserIdRef.current = currentUserId }, [currentUserId])
  useEffect(() => { mutateFundListRef.current = mutateFundList }, [mutateFundList])

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleFundUpdated = (payload: FundEventPayload) => {
      // Refresh fund list (sidebar) + fund detail
      mutateFundListRef.current?.()
      mutate((key) => Array.isArray(key) && key[0] === 'fund' && key[1] === payload.fundId)
    }

    const handleMemberJoined = (payload: MemberEventPayload) => {
      // Refresh fund members
      mutate((key) => Array.isArray(key) && key[0] === 'fund-members' && key[1] === payload.fundId)
      mutateFundListRef.current?.()

      // Toast nếu không phải mình
      if (payload.userId !== currentUserIdRef.current) {
        toast.info(`${payload.userName || 'Thành viên mới'} đã tham gia quỹ`, { duration: 3000 })
      }
    }

    const handleMemberLeft = (payload: MemberEventPayload) => {
      // Refresh fund members
      mutate((key) => Array.isArray(key) && key[0] === 'fund-members' && key[1] === payload.fundId)
      mutateFundListRef.current?.()

      // Toast nếu mình bị xoá
      if (payload.userId === currentUserIdRef.current) {
        toast.warning('Bạn đã bị xoá khỏi quỹ', { duration: 5000 })
      }
    }

    socket.on(SocketEvent.FUND_UPDATED, handleFundUpdated)
    socket.on(SocketEvent.MEMBER_JOINED, handleMemberJoined)
    socket.on(SocketEvent.MEMBER_LEFT, handleMemberLeft)

    return () => {
      socket.off(SocketEvent.FUND_UPDATED, handleFundUpdated)
      socket.off(SocketEvent.MEMBER_JOINED, handleMemberJoined)
      socket.off(SocketEvent.MEMBER_LEFT, handleMemberLeft)
    }
  }, [socket, isConnected])
}
