import { createContext, useCallback, useContext, useState } from 'react'
import { Category, ParsedExpense, Transaction } from '@/lib/types'
import { toast } from 'sonner'
import { useAuth } from './AuthProvider'
import { useCategories } from './CategoryProvider'
import { useAIParser } from './AIParserProvider'

interface TransactionContextValue {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  getTransactionsByFund: (fundId: string | null) => Transaction[]
  isProcessing: boolean
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

function useTransactionState(): TransactionContextValue {
  const { currentUserId, currentUserName } = useAuth()
  const { categories } = useCategories()
  const { parseExpense } = useAIParser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const addTransaction = useCallback(
    async (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
      if (!currentUserId || !currentUserName) return
      if (!newTransaction.fundId) return

      setIsProcessing(true)

      try {
        const fundCategories = categories.filter((c) => c.fundId === newTransaction.fundId)
        const result = await parseExpense(newTransaction.content, currentUserName, fundCategories)

        if (result.success && result.data) {
          const timestamp = newTransaction.promptCreatedAt || Date.now()

          setTransactions((current) => [
            ...current,
            {
              ...newTransaction,
              ...result.data,
              userId: currentUserId,
              userName: currentUserName,
              id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp,
              isPendingPrompt: false,
              originalPrompt: newTransaction.content,
            },
          ])

          toast.success('Đã thêm giao dịch!')
        } else if (result.error === 'system') {
          const timestamp = Date.now()

          setTransactions((current) => [
            ...current,
            {
              ...newTransaction,
              userId: currentUserId,
              userName: currentUserName,
              id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp,
              isPendingPrompt: true,
              originalPrompt: newTransaction.content,
              promptCreatedAt: timestamp,
            },
          ])

          toast.error('Hệ thống tạm lỗi', {
            description: 'Đã lưu thành ghi chú, bạn có thể xử lý sau',
          })
        } else {
          toast.error('Không thể phân tích', {
            description: 'Vui lòng nhập rõ hơn, ví dụ: "bánh mì 25"',
          })
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra', {
          description: 'Vui lòng thử lại',
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [categories, currentUserId, currentUserName, parseExpense]
  )

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions((current) =>
      current.map((transaction) => (transaction.id === updatedTransaction.id ? updatedTransaction : transaction))
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id))
  }, [])

  const getTransactionsByFund = useCallback(
    (fundId: string | null) => transactions.filter((transaction) => transaction.fundId === fundId),
    [transactions]
  )

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
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
