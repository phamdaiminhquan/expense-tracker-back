/**
 * useSocketMessages — Bridge giữa Socket.IO events và SWR chat cache
 *
 * Hook này lắng nghe real-time events từ WebSocket và:
 * - Refresh SWR cache khi nhận message từ user khác
 * - Theo dõi ai đang typing
 * - Xử lý message:updated và message:deleted
 *
 * Sử dụng:
 *   const { typingUsers } = useSocketMessages({ fundId, refresh, currentUserId })
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSocket } from '@/hooks/use-socket'
import { SocketEvent } from '@/common/lib/socket.lib'

interface TypingUser {
  userId: string
  userName: string
}

interface MessageEventPayload {
  message: Record<string, unknown>
  fundId: string
  senderId: string
}

interface MessageDeletedPayload {
  messageId: string
  fundId: string
  deletedBy: string
}

interface TypingEventPayload {
  fundId: string
  userId: string
  userName: string
}

interface UseSocketMessagesOptions {
  /** Fund ID hiện tại đang xem */
  fundId: string | undefined
  /** Hàm refresh SWR cache (từ useInfiniteChat) */
  refresh: () => void
  /** ID user hiện tại (để bỏ qua events của chính mình) */
  currentUserId: string | null
}

interface UseSocketMessagesReturn {
  /** Danh sách users đang typing (trừ user hiện tại) */
  typingUsers: TypingUser[]
}

export function useSocketMessages({
  fundId,
  refresh,
  currentUserId,
}: UseSocketMessagesOptions): UseSocketMessagesReturn {
  const { socket, isConnected } = useSocket()
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  // Refs để tránh stale closure trong event handlers
  const fundIdRef = useRef(fundId)
  const currentUserIdRef = useRef(currentUserId)
  const refreshRef = useRef(refresh)

  useEffect(() => { fundIdRef.current = fundId }, [fundId])
  useEffect(() => { currentUserIdRef.current = currentUserId }, [currentUserId])
  useEffect(() => { refreshRef.current = refresh }, [refresh])

  // Typing timeout cleanup — auto-remove sau 3s không nhận stop
  const typingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const clearTypingTimer = useCallback((userId: string) => {
    const timer = typingTimersRef.current.get(userId)
    if (timer) {
      clearTimeout(timer)
      typingTimersRef.current.delete(userId)
    }
  }, [])

  // Xoá typing user
  const removeTypingUser = useCallback((userId: string) => {
    clearTypingTimer(userId)
    setTypingUsers(prev => prev.filter(u => u.userId !== userId))
  }, [clearTypingTimer])

  useEffect(() => {
    if (!socket || !isConnected || !fundId) return

    // ── Message events ──

    const handleMessageCreated = (payload: MessageEventPayload) => {
      if (payload.fundId !== fundIdRef.current) return
      // Bỏ qua message của chính mình (đã xử lý qua optimistic UI)
      if (payload.senderId === currentUserIdRef.current) return
      refreshRef.current()
    }

    const handleMessageUpdated = (payload: MessageEventPayload) => {
      if (payload.fundId !== fundIdRef.current) return
      refreshRef.current()
    }

    const handleMessageDeleted = (payload: MessageDeletedPayload) => {
      if (payload.fundId !== fundIdRef.current) return
      refreshRef.current()
    }

    // ── Typing events ──

    const handleTypingStart = (payload: TypingEventPayload) => {
      if (payload.fundId !== fundIdRef.current) return
      if (payload.userId === currentUserIdRef.current) return

      setTypingUsers(prev => {
        if (prev.find(u => u.userId === payload.userId)) return prev
        return [...prev, { userId: payload.userId, userName: payload.userName }]
      })

      // Auto-remove sau 4s nếu không nhận stop hoặc start mới
      // Sender re-emit TYPING_START mỗi 2s → 4s đủ buffer
      clearTypingTimer(payload.userId)
      const timer = setTimeout(() => removeTypingUser(payload.userId), 4000)
      typingTimersRef.current.set(payload.userId, timer)
    }

    const handleTypingStop = (payload: TypingEventPayload) => {
      if (payload.fundId !== fundIdRef.current) return
      removeTypingUser(payload.userId)
    }

    // ── Register listeners ──

    socket.on(SocketEvent.MESSAGE_CREATED, handleMessageCreated)
    socket.on(SocketEvent.MESSAGE_UPDATED, handleMessageUpdated)
    socket.on(SocketEvent.MESSAGE_DELETED, handleMessageDeleted)
    socket.on(SocketEvent.TYPING_START, handleTypingStart)
    socket.on(SocketEvent.TYPING_STOP, handleTypingStop)

    return () => {
      socket.off(SocketEvent.MESSAGE_CREATED, handleMessageCreated)
      socket.off(SocketEvent.MESSAGE_UPDATED, handleMessageUpdated)
      socket.off(SocketEvent.MESSAGE_DELETED, handleMessageDeleted)
      socket.off(SocketEvent.TYPING_START, handleTypingStart)
      socket.off(SocketEvent.TYPING_STOP, handleTypingStop)

      // Cleanup typing timers
      typingTimersRef.current.forEach(timer => clearTimeout(timer))
      typingTimersRef.current.clear()
      setTypingUsers([])
    }
  }, [socket, isConnected, fundId, clearTypingTimer, removeTypingUser])

  // Reset typing khi đổi fund
  useEffect(() => {
    setTypingUsers([])
  }, [fundId])

  return { typingUsers }
}
