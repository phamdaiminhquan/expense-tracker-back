import { useKV } from '@github/spark/hooks'
import { Transaction, Fund } from '@/lib/types'
import { LoginForm } from '@/components/LoginForm'
import { FundListScreen } from '@/components/FundListScreen'
import { ChatTransactionView } from '@/components/ChatTransactionView'
import { CreateFundDialog } from '@/components/CreateFundDialog'
import { FundStatisticsDialog } from '@/components/FundStatisticsDialog'
import { Toaster } from '@/components/ui/sonner'
import { useState, useEffect } from 'react'
import { createDefaultPersonalFund, createFund, canAccessFund } from '@/lib/funds'
import { MOCK_USERS } from '@/lib/auth'
import { toast } from 'sonner'
import { parseExpenseWithAI } from '@/lib/gemini'

type Screen = 'fund-list' | 'transaction-view'

function App() {
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [funds, setFunds] = useKV<Fund[]>('funds', [])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>('fund-list')
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false)
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (currentUserId && funds) {
      const userFunds = funds.filter((f) => canAccessFund(f, currentUserId))
      
      if (userFunds.length === 0) {
        const defaultFund = createDefaultPersonalFund(currentUserId, currentUserName || '')
        setFunds((current) => [...(current || []), defaultFund])
      }
    }
  }, [currentUserId, currentUserName, funds, setFunds])

  const handleLogin = (userId: string, userName: string) => {
    setCurrentUserId(userId)
    setCurrentUserName(userName)
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    setCurrentUserName(null)
    setSelectedFundId(null)
    setCurrentScreen('fund-list')
  }

  const handleCreateFund = (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    if (!currentUserId) return

    const newFund = createFund(name, type, currentUserId, memberIds)
    setFunds((current) => [...(current || []), newFund])
    
    toast.success('Đã tạo quỹ thành công!', {
      description: name,
    })
  }

  const handleSelectFund = (fundId: string) => {
    setSelectedFundId(fundId)
    setCurrentScreen('transaction-view')
  }

  const handleBackToFundList = () => {
    setCurrentScreen('fund-list')
    setSelectedFundId(null)
  }

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    if (!currentUserId || !currentUserName) return

    setIsProcessing(true)

    try {
      const result = await parseExpenseWithAI(newTransaction.content, currentUserName)

      if (result.success && result.data) {
        const timestamp = newTransaction.promptCreatedAt || Date.now()
        
        setTransactions((current) => [
          ...(current || []),
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
          ...(current || []),
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

  if (currentScreen === 'fund-list') {
    return (
      <>
        <FundListScreen
          funds={userFunds}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onSelectFund={handleSelectFund}
          onCreateFund={() => setIsCreateFundDialogOpen(true)}
          onLogout={handleLogout}
        />

        <CreateFundDialog
          open={isCreateFundDialogOpen}
          onOpenChange={setIsCreateFundDialogOpen}
          onCreateFund={handleCreateFund}
          currentUserId={currentUserId}
          allUsers={MOCK_USERS}
        />

        <Toaster position="top-right" />
      </>
    )
  }

  if (currentScreen === 'transaction-view' && selectedFund) {
    return (
      <>
        <ChatTransactionView
          fund={selectedFund}
          transactions={fundTransactions}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onBack={handleBackToFundList}
          onShowStatistics={() => setIsStatisticsDialogOpen(true)}
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          isProcessing={isProcessing}
        />

        <FundStatisticsDialog
          open={isStatisticsDialogOpen}
          onOpenChange={setIsStatisticsDialogOpen}
          transactions={fundTransactions}
          fund={selectedFund}
        />

        <Toaster position="top-right" />
      </>
    )
  }

  return null
}

export default App