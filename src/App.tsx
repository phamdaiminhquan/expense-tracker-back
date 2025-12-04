import { useKV } from '@github/spark/hooks'
import { Transaction, Fund } from '@/lib/types'
import { TransactionInput } from '@/components/TransactionInput'
import { TransactionList } from '@/components/TransactionList'
import { LoginForm } from '@/components/LoginForm'
import { FundSelector } from '@/components/FundSelector'
import { CreateFundDialog } from '@/components/CreateFundDialog'
import { FundStatistics } from '@/components/FundStatistics'
import { Toaster } from '@/components/ui/sonner'
import { Sparkle, SignOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createDefaultPersonalFund, createFund, canAccessFund } from '@/lib/funds'
import { MOCK_USERS } from '@/lib/auth'
import { toast } from 'sonner'

function App() {
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [funds, setFunds] = useKV<Fund[]>('funds', [])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null)
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false)

  useEffect(() => {
    if (currentUserId && funds) {
      const userFunds = funds.filter((f) => canAccessFund(f, currentUserId))
      
      if (userFunds.length === 0) {
        const defaultFund = createDefaultPersonalFund(currentUserId, currentUserName || '')
        setFunds((current) => [...(current || []), defaultFund])
        setSelectedFundId(defaultFund.id)
      } else if (!selectedFundId || !userFunds.find((f) => f.id === selectedFundId)) {
        setSelectedFundId(userFunds[0].id)
      }
    }
  }, [currentUserId, currentUserName, funds, selectedFundId, setFunds])

  const handleLogin = (userId: string, userName: string) => {
    setCurrentUserId(userId)
    setCurrentUserName(userName)
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    setCurrentUserName(null)
    setSelectedFundId(null)
  }

  const handleCreateFund = (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    if (!currentUserId) return

    const newFund = createFund(name, type, currentUserId, memberIds)
    setFunds((current) => [...(current || []), newFund])
    setSelectedFundId(newFund.id)
    
    toast.success('Đã tạo quỹ thành công!', {
      description: name,
    })
  }

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    if (!currentUserId || !currentUserName) return

    const timestamp = newTransaction.promptCreatedAt || Date.now()

    setTransactions((current) => [
      ...(current || []),
      {
        ...newTransaction,
        userId: currentUserId,
        userName: currentUserName,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
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

  const userFunds = (funds || []).filter((f) => currentUserId && canAccessFund(f, currentUserId))
  const selectedFund = userFunds.find((f) => f.id === selectedFundId) || null
  const fundTransactions = (transactions || []).filter((t) => t.fundId === selectedFundId)

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
          <FundSelector
            funds={userFunds}
            selectedFundId={selectedFundId}
            onSelectFund={setSelectedFundId}
            onCreateFund={() => setIsCreateFundDialogOpen(true)}
            currentUserId={currentUserId}
          />

          <TransactionInput
            onAdd={handleAddTransaction}
            currentUserName={currentUserName}
            currentFundId={selectedFundId}
          />

          <FundStatistics transactions={fundTransactions} fund={selectedFund} />

          <TransactionList
            transactions={fundTransactions}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>

      <CreateFundDialog
        open={isCreateFundDialogOpen}
        onOpenChange={setIsCreateFundDialogOpen}
        onCreateFund={handleCreateFund}
        currentUserId={currentUserId}
        allUsers={MOCK_USERS}
      />

      <Toaster position="top-right" />
    </div>
  )
}

export default App