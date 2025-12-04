import { useKV } from '@github/spark/hooks'
import { Transaction } from '@/lib/types'
import { TransactionInput } from '@/components/TransactionInput'
import { StatisticsCards } from '@/components/StatisticsCards'
import { TransactionList } from '@/components/TransactionList'
import { LoginForm } from '@/components/LoginForm'
import { Toaster } from '@/components/ui/sonner'
import { Sparkle, SignOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function App() {
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)

  const handleLogin = (userId: string, userName: string) => {
    setCurrentUserId(userId)
    setCurrentUserName(userName)
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    setCurrentUserName(null)
  }

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    if (!currentUserId || !currentUserName) return

    setTransactions((current) => [
      ...(current || []),
      {
        ...newTransaction,
        userId: currentUserId,
        userName: currentUserName,
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

  const userTransactions = (transactions || []).filter((t) => t.userId === currentUserId)

  if (!currentUserId || !currentUserName) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sparkle weight="fill" className="text-primary" size={40} />
              Chi Tiêu Thông Minh
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Xin chào,</p>
                <p className="font-semibold">{currentUserName}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <SignOut />
                Đăng xuất
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Quản lý chi tiêu với trí tuệ nhân tạo - chỉ cần nhập, AI sẽ lo
          </p>
        </header>

        <div className="space-y-6">
          <TransactionInput onAdd={handleAddTransaction} currentUserName={currentUserName} />
          <StatisticsCards transactions={userTransactions} />
          <TransactionList
            transactions={userTransactions}
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