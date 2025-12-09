import { useTransactions as useTransactionsFromProvider, TransactionProvider } from '@/app/providers/TransactionProvider'

export function useTransactions() {
  return useTransactionsFromProvider()
}

export { TransactionProvider }
