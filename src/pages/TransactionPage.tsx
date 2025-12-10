import { useState } from 'react'
import { Transaction, Fund, Category } from '@/lib/types'
import { ChatTransactionView } from '@/components/ChatTransactionView'
import { FundStatisticsDialog } from '@/components/FundStatisticsDialog'
import { CategoryManagementDialog } from '@/components/CategoryManagementDialog'

interface TransactionPageProps {
  fund: Fund
  transactions: Transaction[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  resolveUserName: (userId: string) => string
  onBack: () => void
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>
  onUpdateTransaction: (transaction: Transaction) => Promise<void>
  onDeleteTransaction: (id: string) => Promise<void>
  onCreateCategory: (name: string, description: string) => void
  onUpdateCategory: (categoryId: string, name: string, description: string) => void
  onDeleteCategory: (categoryId: string) => void
  isProcessing?: boolean
}

export function TransactionPage({
  fund,
  transactions,
  categories,
  currentUserId,
  currentUserName,
  resolveUserName,
  onBack,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isProcessing = false,
}: TransactionPageProps) {
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)

  return (
    <>
      <ChatTransactionView
        fund={fund}
        transactions={transactions}
        categories={categories}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        onBack={onBack}
        onShowStatistics={() => setIsStatisticsDialogOpen(true)}
        onManageCategories={() => setIsCategoryDialogOpen(true)}
        onAddTransaction={onAddTransaction}
        onUpdateTransaction={onUpdateTransaction}
        onDeleteTransaction={onDeleteTransaction}
        resolveUserName={resolveUserName}
        isProcessing={isProcessing}
      />

      <FundStatisticsDialog
        open={isStatisticsDialogOpen}
        onOpenChange={setIsStatisticsDialogOpen}
        transactions={transactions}
        categories={categories}
        fund={fund}
        resolveUserName={resolveUserName}
      />

      <CategoryManagementDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        categories={categories}
        transactions={transactions}
        onCreateCategory={onCreateCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </>
  )
}
