import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Category, Transaction } from '@/lib/types'
import { toast } from 'sonner'
import { useAuth } from './AuthProvider'
import {
  createTransaction,
  deleteTransactionApi,
  listTransactionsByFund,
  updateTransactionApi,
} from '@/apis/transactions/transaction.api'
import { CreateTransactionPayload, UpdateTransactionPayload } from '@/apis/transactions/transaction.interface'

interface TransactionContextValue {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>
  updateTransaction: (transaction: Transaction) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  fetchTransactionsByFund: (fundId: string | null) => Promise<void>
  getTransactionsByFund: (fundId: string | null) => Transaction[]
  isProcessing: boolean
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

function useTransactionState(): TransactionContextValue {
  const { currentUserId, currentUserName } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const addTransaction = useCallback(
    async (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
      if (!currentUserId || !currentUserName) return
      if (!newTransaction.fundId) return

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const optimistic: Transaction = {
        ...newTransaction,
        userId: currentUserId,
        userName: currentUserName,
        id: tempId,
        clientTempId: tempId,
        clientStatus: 'sending',
        timestamp: Date.now(),
        status: 'pending',
        isPendingPrompt: true,
        originalPrompt: newTransaction.content,
        promptCreatedAt: Date.now(),
      }

      setTransactions((current) => [...current, optimistic])
      setIsProcessing(true)

      try {
        const payload: CreateTransactionPayload = {
          rawPrompt: newTransaction.content,
        }

        if (newTransaction.spend !== null) payload.spendValue = newTransaction.spend
        if (newTransaction.earn !== null) payload.earnValue = newTransaction.earn
        if (newTransaction.content) payload.content = newTransaction.content
        if (newTransaction.categoryId) payload.categoryId = newTransaction.categoryId

        const created = await createTransaction(newTransaction.fundId, payload)
        const merged: Transaction = { ...created, clientStatus: 'sent', clientTempId: tempId }

        setTransactions((current) => current.map((t) => (t.id === tempId ? merged : t)))

        toast.success(created.status === 'pending' ? 'Đã lưu ghi chú, sẽ xử lý sau' : 'Đã thêm giao dịch!')
      } catch (error) {
        setTransactions((current) =>
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

  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    try {
      const payload: UpdateTransactionPayload = {
        spendValue: updatedTransaction.spend,
        earnValue: updatedTransaction.earn,
        content: updatedTransaction.content,
        categoryId: updatedTransaction.categoryId ?? undefined,
        status: updatedTransaction.status ?? (updatedTransaction.isPendingPrompt ? 'pending' : 'processed'),
      }

      const refreshed = await updateTransactionApi(updatedTransaction.id, payload)

      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === refreshed.id ? { ...refreshed, clientStatus: 'sent' } : transaction
        )
      )
    } catch (error) {
      toast.error('Cập nhật giao dịch thất bại', {
        description: 'Vui lòng thử lại',
      })
      throw error
    }
  }, [])

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await deleteTransactionApi(id)
      setTransactions((current) => current.filter((transaction) => transaction.id !== id))
    } catch (error) {
      toast.error('Xóa giao dịch thất bại', {
        description: 'Vui lòng thử lại',
      })
      throw error
    }
  }, [])

  const fetchTransactionsByFund = useCallback(async (fundId: string | null) => {
    if (!fundId) return

    try {
      const data = await listTransactionsByFund(fundId)
      setTransactions((current) => {
        const others = current.filter((transaction) => transaction.fundId !== fundId)
        const normalized = data.map((t) => ({ ...t, clientStatus: 'sent' as const }))
        return [...others, ...normalized]
      })
    } catch (error) {
      toast.error('Không thể tải giao dịch', {
        description: 'Vui lòng thử lại sau',
      })
    }
  }, [])

  const getTransactionsByFund = useCallback(
    (fundId: string | null) => transactions.filter((transaction) => transaction.fundId === fundId),
    [transactions]
  )

  useEffect(() => {
    if (!currentUserId) {
      setTransactions([])
    }
  }, [currentUserId])

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactionsByFund,
    getTransactionsByFund,
    isProcessing,
    setTransactions,
  }
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const value = useTransactionState()
  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

export function useTransactions(): TransactionContextValue {
  const ctx = useContext(TransactionContext)
  if (!ctx) {
    throw new Error('useTransactions must be used within TransactionProvider')
  }
  return ctx
}

export { TransactionContext }
