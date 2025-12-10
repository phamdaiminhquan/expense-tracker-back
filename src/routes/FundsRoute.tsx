import { useNavigate } from 'react-router-dom'
import { FundListPage } from '@/pages/FundListPage'
import { useAuth } from '@/hooks/useAuth'
import { useFunds } from '@/hooks/useFunds'

export function FundsRoute() {
  const navigate = useNavigate()
  const { currentUser, currentUserId, currentUserName, logout } = useAuth()
  const { visibleFunds, fetchFunds, createFund, enterFund, isLoading, isCreating } = useFunds()

  return (
    <FundListPage
      currentUser={currentUser}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      funds={visibleFunds}
      isLoadingFunds={isLoading || isCreating}
      onRefreshFunds={fetchFunds}
      onSelectFund={(fund) => {
        enterFund(fund)
        navigate(`/funds/${fund.id}`)
      }}
      onCreateFund={async (name, type, memberIds) => {
        const fund = await createFund(name, type, memberIds)
        navigate(`/funds/${fund.id}`)
      }}
      onLogout={logout}
    />
  )
}
