import { useMemo, useState } from 'react'
import { Fund } from '@/lib/types'
import { FundListScreen } from '@/components/FundListScreen'
import { CreateFundDialog } from '@/components/CreateFundDialog'
import { User } from '@/lib/auth'
import { toast } from 'sonner'

interface FundListPageProps {
  currentUserId: string
  currentUserName: string
  currentUser: User | null
  funds: Fund[]
  isLoadingFunds?: boolean
  onRefreshFunds?: () => void
  onSelectFund: (fund: Fund) => void
  onCreateFund: (name: string, type: 'personal' | 'shared', memberIds: string[]) => Promise<void>
  onLogout: () => void
}

export function FundListPage({
  currentUserId,
  currentUserName,
  currentUser,
  funds,
  isLoadingFunds = false,
  onRefreshFunds,
  onSelectFund,
  onCreateFund,
  onLogout,
}: FundListPageProps) {
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false)

  const visibleFunds = useMemo(
    () => funds,
    [funds]
  )

  const handleCreateFund = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    try {
      await onCreateFund(name, type, memberIds)
      toast.success('Đã tạo quỹ thành công!', { description: name })
    } catch (error) {
      console.error(error)
      toast.error('Tạo quỹ thất bại', { description: 'Vui lòng thử lại' })
    }
  }

  const handleSelectFund = (fundId: string) => {
    const found = funds.find((f) => f.id === fundId)
    if (found) {
      onSelectFund(found)
    }
  }

  return (
    <>
      <FundListScreen
        funds={visibleFunds}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        onSelectFund={handleSelectFund}
        onCreateFund={() => setIsCreateFundDialogOpen(true)}
        onLogout={onLogout}
        isLoading={isLoadingFunds}
        onRefresh={onRefreshFunds}
      />

      <CreateFundDialog
        open={isCreateFundDialogOpen}
        onOpenChange={setIsCreateFundDialogOpen}
        onCreateFund={handleCreateFund}
        currentUserId={currentUserId}
        allUsers={currentUser ? [currentUser] : []}
      />
    </>
  )
}
