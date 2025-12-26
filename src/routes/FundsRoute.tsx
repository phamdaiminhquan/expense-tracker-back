import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FundListPage } from '@/pages/fund/fund.page';
import { useAuth } from '@/hooks/useAuth';
import { PAGE_TAKE_DEFAULT } from '@/common/constant/page-take.constant';
import { useFund } from '@/app/providers/FundProvider';

export function FundsRoute() {
  // hook
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentUserId, currentUserName, logout } = useAuth();
  
  // state
  const [params] = useState({
    ...PAGE_TAKE_DEFAULT,
    page: 1,
    take: 10,
  });

  // Use fund hook
  const {
    fundList,
    isLoadingList: isLoading,
    loading: isCreating,
    createFund,
    mutateList: refetchFunds,
  } = useFund(params);

  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const hasInitialized = useRef(false);

  // Get visible funds (filter by access permission)
  const visibleFunds = useMemo(() => {
    if (!fundList?.data || !currentUserId) return [];
    return fundList?.data.filter(
      (fund) => fund.ownerId === currentUserId || fund.memberIds.includes(currentUserId)
    );
  }, [fundList?.data, currentUserId]);

  // Check if this is a fresh login (from login page)
  useEffect(() => {
    if (hasInitialized.current) return;

    const isFromLogin = location.state?.fromLogin === true || sessionStorage.getItem('justLoggedIn') === 'true';
    if (isFromLogin) {
      hasInitialized.current = true;
      setShowLoadingScreen(true);
      sessionStorage.removeItem('justLoggedIn');
    }
  }, [location.state]);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  // Handle select fund
  const handleSelectFund = (fundId: string) => {
    navigate(`/funds/${fundId}`);
  };

  // Handle create fund
  const handleCreateFund = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    const newFund = await createFund({ name, type, memberIds });
    navigate(`/funds/${newFund.id}`);
  };

  return (
    <React.Fragment>
      <div
        className={
          showLoadingScreen
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 transition-opacity duration-500 pointer-events-auto'
        }
      >
        <FundListPage
          currentUser={currentUser}
          currentUserId={currentUserId as string}
          currentUserName={currentUserName as string}
          funds={visibleFunds}
          isLoadingFunds={isLoading || isCreating}
          onRefreshFunds={refetchFunds}
          onSelectFund={(fund) => handleSelectFund(fund.id)}
          onCreateFund={handleCreateFund}
          onLogout={logout}
        />
      </div>
    </React.Fragment>
  );
}
