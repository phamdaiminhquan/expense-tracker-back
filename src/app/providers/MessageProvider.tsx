import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Category, Message } from '@/lib/types'
import { toast } from 'sonner'
import { useAuth } from './AuthProvider'
import { CreateMessagePayload, UpdateMessagePayload } from '@/apis/messages/message.interface'
import { createMessage, updateMessageApi, deleteMessageApi, listMessagesByFund } from '@/apis/messages/message.api'

interface MessageContextValue {
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>
  updateMessage: (message: Message) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  fetchMessagesByFund: (fundId: string | null) => Promise<void>
  getMessagesByFund: (fundId: string | null) => Message[]
  isProcessing: boolean
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const MessageContext = createContext<MessageContextValue | null>(null)

function useMessageState(): MessageContextValue {
  const { currentUserId, currentUserName } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const addMessage = useCallback(
    async (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
      if (!currentUserId || !currentUserName) return
      if (!newMessage.fundId) return

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const optimistic: Message = {
        ...newMessage,
        userId: currentUserId,
        userName: currentUserName,
        id: tempId,
        clientTempId: tempId,
        clientStatus: 'sending',
        timestamp: Date.now(),
        status: 'pending',
        isPendingPrompt: true,
        originalPrompt: newMessage.message,
        promptCreatedAt: Date.now(),
      }

      setMessages((current) => [...current, optimistic])
      setIsProcessing(true)

      try {
        const payload: CreateMessagePayload = {
          message: newMessage.message,
        }

        if (newMessage.spend !== null) payload.spendValue = newMessage.spend
        if (newMessage.earn !== null) payload.earnValue = newMessage.earn
        if (newMessage.message) payload.message = newMessage.message
        if (newMessage.categoryId) payload.categoryId = newMessage.categoryId

        const created = await createMessage(newMessage.fundId, payload)
        const merged: Message = { ...created, clientStatus: 'sent', clientTempId: tempId }

        setMessages((current) => current.map((t) => (t.id === tempId ? merged : t)))

        toast.success(created.status === 'pending' ? 'Đã lưu ghi chú, sẽ xử lý sau' : 'Đã thêm giao dịch!')
      } catch (error) {
        setMessages((current) =>
          current.map((t) => (t.id === tempId ? { ...t, clientStatus: 'failed' } : t))
        )
        toast.error('Có lỗi xảy ra', {
          description: 'Vui lòng thử lại',
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [currentUserId, currentUserName]
  )

  const updateMessage = useCallback(async (updatedMessage: Message) => {
    try {
      const payload: UpdateMessagePayload = {
        spendValue: updatedMessage.spend,
        earnValue: updatedMessage.earn,
        message: updatedMessage.message,
        categoryId: updatedMessage.categoryId ?? undefined,
        status: updatedMessage.status ?? (updatedMessage.isPendingPrompt ? 'pending' : 'processed'),
      }

      const refreshed = await updateMessageApi(updatedMessage.id, payload)

      setMessages((current) =>
        current.map((message) =>
          message.id === refreshed.id ? { ...refreshed, clientStatus: 'sent' } : message
        )
      )
    } catch (error) {
      toast.error('Cập nhật giao dịch thất bại', {
        description: 'Vui lòng thử lại',
      })
      throw error
    }
  }, [])

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await deleteMessageApi(id)
      setMessages((current) => current.filter((message) => message.id !== id))
    } catch (error) {
      toast.error('Xóa giao dịch thất bại', {
        description: 'Vui lòng thử lại',
      })
      throw error
    }
  }, [])

  const fetchMessagesByFund = useCallback(async (fundId: string | null) => {
    if (!fundId) return

    try {
      const data = await listMessagesByFund(fundId)
      setMessages((current) => {
        const others = current.filter((message) => message.fundId !== fundId)
        const normalized = data.map((t) => ({ ...t, clientStatus: 'sent' as const }))
        return [...others, ...normalized]
      })
    } catch (error) {
      toast.error('Không thể tải giao dịch', {
        description: 'Vui lòng thử lại sau',
      })
    }
  }, [])

  const getMessagesByFund = useCallback(
    (fundId: string | null) => messages.filter((message) => message.fundId === fundId),
    [messages]
  )

  useEffect(() => {
    if (!currentUserId) {
      setMessages([])
    }
  }, [currentUserId])

  return {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    fetchMessagesByFund,
    getMessagesByFund,
    isProcessing,
    setMessages,
  }
}

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const value = useMessageState()
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export function useMessages(): MessageContextValue {
  const ctx = useContext(MessageContext)
  if (!ctx) {
    throw new Error('useMessages must be used within MessageProvider')
  }
  return ctx
}

export { MessageContext }
