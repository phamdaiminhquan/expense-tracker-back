/**
 * SocketProvider — Quản lý kết nối WebSocket trong React context
 *
 * Đặt SAU AuthProvider trong provider tree.
 * Tự động connect khi user authenticated, disconnect khi logout.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Socket } from 'socket.io-client'
import { toast } from 'sonner'
import {
  createSocket,
  disconnectSocket,
  getSocket,
  SocketEvent,
} from '@/common/lib/socket.lib'
import { useAuth } from '@/hooks/use-auth'

// ── Context Value ──

export interface SocketContextValue {
  /** Socket.IO client instance (null nếu chưa kết nối) */
  socket: Socket | null
  /** Trạng thái kết nối hiện tại */
  isConnected: boolean
  /** Danh sách rooms đã join (từ server) */
  joinedRooms: string[]
  /** Emit typing:start tới fund */
  emitTyping: (fundId: string) => void
  /** Emit typing:stop tới fund */
  stopTyping: (fundId: string) => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

// ── Provider ──

function useSocketState(): SocketContextValue {
  const { session, isAuthed } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [joinedRooms, setJoinedRooms] = useState<string[]>([])
  const socketRef = useRef<Socket | null>(null)

  // Typing debounce — tránh spam typing events
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTypingFundRef = useRef<string | null>(null)
  const wasConnectedRef = useRef(false)
  const reconnectToastIdRef = useRef<string | number | null>(null)

  // Connect/disconnect theo auth state
  // Chỉ depend vào isAuthed, không depend vào accessToken
  // để tránh reconnect mỗi lần token refresh chủ động (60s)
  useEffect(() => {
    if (!isAuthed || !session?.accessToken) {
      disconnectSocket()
      socketRef.current = null
      setIsConnected(false)
      setJoinedRooms([])
      return
    }

    // Nếu socket đã connected → không tạo lại (tránh reconnect khi token refresh)
    if (socketRef.current?.connected) return

    const sock = createSocket(session.accessToken)
    socketRef.current = sock

    sock.on('connect', () => {
      setIsConnected(true)
      // Nếu đã từng connected → đây là reconnect → dismiss toast
      if (wasConnectedRef.current) {
        if (reconnectToastIdRef.current) {
          toast.dismiss(reconnectToastIdRef.current)
          reconnectToastIdRef.current = null
        }
        toast.success('Đã kết nối lại!', { duration: 2000 })
      }
      wasConnectedRef.current = true
    })

    sock.on('disconnect', (reason) => {
      setIsConnected(false)
      setJoinedRooms([])
      // Chỉ hiện toast nếu disconnect bất ngờ (không phải do logout/cleanup)
      if (wasConnectedRef.current && reason !== 'io client disconnect') {
        reconnectToastIdRef.current = toast.loading('Đang kết nối lại...', {
          duration: Infinity,
        })
      }
    })

    sock.on(SocketEvent.CONNECTION_SUCCESS, (payload: { rooms: string[] }) => {
      setJoinedRooms(payload.rooms || [])
    })

    sock.on(SocketEvent.ERROR, (err: { message: string }) => {
      console.error('[Socket] Server error:', err.message)
    })

    return () => {
      disconnectSocket()
      socketRef.current = null
      setIsConnected(false)
      setJoinedRooms([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  // Emit typing:start — re-emit mỗi 2s để receiver không auto-remove
  // Auto-stop sau 2s ngừng gõ
  const emitTyping = useCallback((fundId: string) => {
    const sock = getSocket()
    if (!sock?.connected) return

    // Luôn gửi TYPING_START (không chỉ lần đầu)
    // để receiver reset timeout 4s
    sock.emit(SocketEvent.TYPING_START, { fundId })
    lastTypingFundRef.current = fundId

    // Reset timer
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      sock.emit(SocketEvent.TYPING_STOP, { fundId })
      lastTypingFundRef.current = null
    }, 2000)
  }, [])

  // Emit typing:stop ngay lập tức (khi gửi message, blur, etc.)
  const stopTyping = useCallback((fundId: string) => {
    const sock = getSocket()
    if (!sock?.connected) return

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }

    if (lastTypingFundRef.current === fundId) {
      sock.emit(SocketEvent.TYPING_STOP, { fundId })
      lastTypingFundRef.current = null
    }
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    joinedRooms,
    emitTyping,
    stopTyping,
  }
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const value = useSocketState()
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext)
  if (!ctx) {
    throw new Error('useSocket phải được dùng bên trong SocketProvider')
  }
  return ctx
}
