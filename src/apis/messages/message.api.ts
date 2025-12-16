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
  return {
    id: dto.id,
    fundId: dto.fundId,
    userId: dto.createdById || 'unknown',
    userName: dto.createdByName || 'Thành viên',
    spend: dto.spendValue ?? null,
    earn: dto.earnValue ?? null,
    message: dto.message || '',
    categoryId: dto.categoryId ?? null,
    timestamp: parseTimestamp(dto.createdAt),
    status: dto.status,
    isPendingPrompt: dto.status === 'pending',
    originalPrompt: dto.message || undefined,
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

export async function getMessageDetail(transactionId: string): Promise<Message> {
  const res = await axiosRequest.get<MessageDto>(`/messages/${transactionId}`)
  return mapMessage(res.data)
}

export async function updateMessageApi(transactionId: string, payload: UpdateMessagePayload): Promise<Message> {
  const res = await axiosRequest.patch<MessageDto>(`/messages/${transactionId}`, payload)
  return mapMessage(res.data)
}

export async function deleteMessageApi(transactionId: string): Promise<boolean> {
  await axiosRequest.delete(`/messages/${transactionId}`)
  return true
}
