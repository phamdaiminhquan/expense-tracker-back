import { axiosRequest } from '@/common/config/axios.config'
import { Message } from '@/lib/types'
import { CreateMessagePayload, MessageDto, UpdateMessagePayload } from './message.interface'

function parseTimestamp(input?: string | number): number {
  if (typeof input === 'number') return input
  if (typeof input === 'string') {
    const n = Date.parse(input)
    return Number.isNaN(n) ? Date.now() : n
  }
  return Date.now()
}

function mapMessage(dto: MessageDto): Message {
  // Priority: transaction data > message data (for backward compatibility)
  const transaction = dto.transaction
  const category = transaction?.category || null
  
  // Use transaction values if available, otherwise fall back to message-level values
  const spendValue = transaction?.spendValue ?? dto.spendValue ?? null
  const earnValue = transaction?.earnValue ?? dto.earnValue ?? null
    const categoryId = transaction?.categoryId ?? transaction?.category?.id ?? dto.categoryId ?? null
  const categoryName = transaction?.category?.name ?? null
  const messageText = transaction?.content ?? dto.message ?? ''
  
  return {
    id: dto.id,
    fundId: dto.fundId || dto.fund?.id || '',
    userId: dto.createdById || 'unknown',
    userName: dto.createdByName || 'Thành viên',
    spend: spendValue,
    earn: earnValue,
    message: messageText,
    categoryId: categoryId,
    categoryName: categoryName,
    timestamp: parseTimestamp(dto.createdAt || transaction?.createdAt),
    status: dto.status,
    isPendingPrompt: dto.status === 'pending',
    originalPrompt: dto.message || messageText || undefined,
    promptCreatedAt: dto.message ? parseTimestamp(dto.createdAt) : undefined,
  }

}

export async function listMessagesByFund(fundId: string): Promise<Message[]> {
  const res = await axiosRequest.get<MessageDto[]>(`/funds/${fundId}/messages`)
  return (res.data || []).map(mapMessage)
}

export async function createMessage(fundId: string, payload: CreateMessagePayload): Promise<Message> {
  const res = await axiosRequest.post<MessageDto>(`/funds/${fundId}/messages`, payload)
  return mapMessage(res.data)
}

export async function getMessageDetail(messageId: string): Promise<Message> {
  const res = await axiosRequest.get<MessageDto>(`/messages/${messageId}`)
  return mapMessage(res.data)
}

export async function updateMessageApi(messageId: string, payload: UpdateMessagePayload): Promise<Message> {
  const res = await axiosRequest.patch<MessageDto>(`/messages/${messageId}`, payload)
  return mapMessage(res.data)
}

export async function deleteMessageApi(messageId: string): Promise<boolean> {
  await axiosRequest.delete(`/messages/${messageId}`)
  return true
}
