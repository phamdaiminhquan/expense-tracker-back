import { useKV } from '@github/spark/hooks'
import { Transaction } from '@/lib/types'
import { TransactionInput } from '@/components/TransactionInput'
import { StatisticsCards } from '@/components/StatisticsCards'
import { TransactionList } from '@/components/TransactionList'
import { Toaster } from '@/components/ui/sonner'
import { Sparkle } from '@phosphor-icons/react'

function App() {
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    setTransactions((current) => [
      ...(current || []),
      {
        ...newTransaction,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      },
    ])
  }

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((current) =>
      (current || []).map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    )
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions((current) => (current || []).filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkle weight="fill" className="text-primary" size={40} />
            Chi Tiêu Thông Minh
          </h1>
          <p className="text-muted-foreground text-lg">
            Quản lý chi tiêu với trí tuệ nhân tạo - chỉ cần nhập, AI sẽ lo
          </p>
        </header>

        <div className="space-y-6">
          <TransactionInput onAdd={handleAddTransaction} />
          <StatisticsCards transactions={transactions || []} />
          <TransactionList
            transactions={transactions || []}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default App