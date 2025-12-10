import { axiosRequest } from '@/common/config/axios.config'
import { Transaction } from '@/lib/types'
import { CreateTransactionPayload, TransactionDto, UpdateTransactionPayload } from './transaction.interface'

function parseTimestamp(input?: string | number): number {
  if (typeof input === 'number') return input
  if (typeof input === 'string') {
    const n = Date.parse(input)
    return Number.isNaN(n) ? Date.now() : n
  }
  return Date.now()
}

function mapTransaction(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    fundId: dto.fundId,
    userId: dto.createdById || 'unknown',
    userName: dto.createdByName || 'Thành viên',
    spend: dto.spendValue ?? null,
    earn: dto.earnValue ?? null,
    content: dto.content || dto.rawPrompt || '',
    categoryId: dto.categoryId ?? null,
    timestamp: parseTimestamp(dto.createdAt),
    status: dto.status,
    isPendingPrompt: dto.status === 'pending',
    originalPrompt: dto.rawPrompt || undefined,
    promptCreatedAt: dto.rawPrompt ? parseTimestamp(dto.createdAt) : undefined,
  }
}

export async function listTransactionsByFund(fundId: string): Promise<Transaction[]> {
  const res = await axiosRequest.get<TransactionDto[]>(`/funds/${fundId}/transactions`)
  return (res.data || []).map(mapTransaction)
}

export async function createTransaction(fundId: string, payload: CreateTransactionPayload): Promise<Transaction> {
  const res = await axiosRequest.post<TransactionDto>(`/funds/${fundId}/transactions`, payload)
  return mapTransaction(res.data)
}

export async function getTransactionDetail(transactionId: string): Promise<Transaction> {
  const res = await axiosRequest.get<TransactionDto>(`/transactions/${transactionId}`)
  return mapTransaction(res.data)
}

export async function updateTransactionApi(transactionId: string, payload: UpdateTransactionPayload): Promise<Transaction> {
  const res = await axiosRequest.patch<TransactionDto>(`/transactions/${transactionId}`, payload)
  return mapTransaction(res.data)
}

export async function deleteTransactionApi(transactionId: string): Promise<boolean> {
  await axiosRequest.delete(`/transactions/${transactionId}`)
  return true
}
