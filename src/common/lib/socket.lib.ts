/**
 * Socket.IO Client — Singleton instance cho kết nối WebSocket
 *
 * Sử dụng:
 *   import { createSocket, disconnectSocket, getSocket } from '@/common/lib/socket.lib'
 *
 * Kết nối:
 *   createSocket(accessToken) → Socket instance
 *
 * Ngắt kết nối:
 *   disconnectSocket()
 */

import { io, Socket } from 'socket.io-client'
import { appConfig } from '@/global-config'
import { loadAuthSession } from '@/common/lib/auth.lib'

// ── Socket Events (phải khớp với backend SocketEvent enum) ──
export const SocketEvent = {
  // Connection
  CONNECTION_SUCCESS: 'connection:success',
  ERROR: 'error',

  // Chat
  MESSAGE_CREATED: 'message:created',
  MESSAGE_UPDATED: 'message:updated',
  MESSAGE_DELETED: 'message:deleted',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',

  // Fund
  FUND_UPDATED: 'fund:updated',
  MEMBER_JOINED: 'member:joined',
  MEMBER_LEFT: 'member:left',
} as const

export type SocketEventType = (typeof SocketEvent)[keyof typeof SocketEvent]

// ── Singleton socket instance ──
let socket: Socket | null = null

/**
 * Tạo và kết nối socket instance mới.
 * Nếu đã có instance → disconnect trước rồi tạo mới.
 */
export function createSocket(accessToken: string): Socket {
  if (socket?.connected) {
    socket.disconnect()
  }

  socket = io(`${appConfig.wsUrl}/chat`, {
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5,
    timeout: 20000,
  })

  // Khi connect_error do token hết hạn → thử refresh token
  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message)

    // Thử lấy token mới từ localStorage (đã được refresh bởi axios interceptor)
    const session = loadAuthSession()
    if (session?.accessToken && socket) {
      socket.auth = { token: session.accessToken }
    }
  })

  return socket
}

/**
 * Ngắt kết nối và xoá socket instance.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

/**
 * Lấy socket instance hiện tại (có thể null nếu chưa connect).
 */
export function getSocket(): Socket | null {
  return socket
}
