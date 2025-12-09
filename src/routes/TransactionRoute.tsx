import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TransactionPage } from '@/pages/TransactionPage'
import { useFunds } from '@/hooks/useFunds'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/hooks/useAuth'

export function TransactionRoute() {
  const { fundId } = useParams()
  const navigate = useNavigate()

  const { visibleFunds, enterFund } = useFunds()
  const { currentUserId, currentUserName, resolveUserName } = useAuth()
  const { addTransaction, updateTransaction, deleteTransaction, getTransactionsByFund, isProcessing } = useTransactions()
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories()

  const fund = useMemo(() => visibleFunds.find((f) => f.id === fundId), [fundId, visibleFunds])

  const fundCategories = useMemo(() => categories.filter((c) => c.fundId === fundId), [categories, fundId])
  const fundTransactions = useMemo(() => getTransactionsByFund(fundId || null), [fundId, getTransactionsByFund])

  useEffect(() => {
    if (fund) enterFund(fund)
  }, [fund, enterFund])

  if (!fund) return <div className="h-screen flex items-center justify-center text-sm text-gray-500">Không tìm thấy quỹ</div>

  return (
    <TransactionPage
      fund={fund}
      transactions={fundTransactions}
      categories={fundCategories}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      resolveUserName={resolveUserName}
      onBack={() => navigate('/funds')}
      onAddTransaction={addTransaction}
      onUpdateTransaction={updateTransaction}
      onDeleteTransaction={deleteTransaction}
      onCreateCategory={(name, description) => createCategory(fundId || null, name, description)}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
      isProcessing={isProcessing}
    />
  )
}
