import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { FundListPage } from '@/pages/FundListPage'
import { useAuth } from '@/hooks/useAuth'
import { useFunds } from '@/hooks/useFunds'
import { LoadingScreen } from '@/components/LoadingScreen'

export function FundsRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, currentUserId, currentUserName, logout } = useAuth()
  const { visibleFunds, fetchFunds, createFund, enterFund, isLoading, isCreating } = useFunds()
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const hasInitialized = useRef(false)

  // Check if this is a fresh login (from login page)
  useEffect(() => {
    if (hasInitialized.current) return
    
    const isFromLogin = location.state?.fromLogin === true || sessionStorage.getItem('justLoggedIn') === 'true'
    if (isFromLogin) {
      hasInitialized.current = true
      setShowLoadingScreen(true)
      sessionStorage.removeItem('justLoggedIn')
      // Trigger fetch funds
      fetchFunds()
    }
  }, [location.state, fetchFunds])

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
  }

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen 
          onComplete={handleLoadingComplete}
          isLoading={isLoading || isCreating}
        />
      )}
      <div className={showLoadingScreen ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500 pointer-events-auto'}>
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
      </div>
    </>
  )
}
