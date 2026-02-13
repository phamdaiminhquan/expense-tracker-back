import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { MessagePage } from "@/pages/message/message.page";
import { PAGE_TAKE_DEFAULT } from "@/common/constant/page-take.constant";
import { useFund } from "@/app/providers/FundProvider";
import { useAppReady } from "@/app/providers/app-ready.context";
import { getFundSearchNumberId } from "@/apis/funds/fund.api";
import { getListWallets } from "@/apis/wallets/wallet.api";
import { toast } from "sonner";
import useSWR from "swr";
import LoadingScreenZen from "@/components/elements/screen/screen-loading-zen.element";
import { ScreenWelcome } from "@/components/elements/screen/screen-welcome.element";

export function MessageRoute() {
  const { fundId } = useParams();
  const navigate = useNavigate();

  const {
    currentUserId,
    currentUserName,
    currentUser,
    logout,
  } = useAuth();
  const { setAppReady } = useAppReady();

  // State
  const [fundParams, setFundParams] = useState({
    ...PAGE_TAKE_DEFAULT,
    page: 1,
    take: 10,
  });

  const {
    fundList,
    fund,
    isLoadingList: isLoadingFunds,
    isLoadingFund,
    loading: isFundProcessing,
    createFund,
    updateFund,
    deleteFund,
    mutateFund,
    mutateList,
    needJoinFund,
  } = useFund(fundParams, fundId);

  // Get accessible funds
  const accessibleFunds = useMemo(() => {
    if (!fundList?.data) return [];
    return fundList.data.filter((f) => f.canAccess !== false);
  }, [fundList?.data]);

  // Auto-select fund
  const selectedFund = useMemo(() => {
    if (fundId && fund) return fund;
    return accessibleFunds[0] ?? null;
  }, [fundId, fund, accessibleFunds]);

  // Fetch wallets data for onboarding check
  const { data: walletsData, mutate: mutateWallets } = useSWR(
    "onboarding-wallets",
    async () => await getListWallets({ page: 1, take: 10 }),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  // Signal app ready khi đã có data
  useEffect(() => {
    if (!isLoadingFunds) {
      setAppReady();
    }
  }, [isLoadingFunds, setAppReady]);

  // Redirect to invite page if fund is not accessible
  useEffect(() => {
    if (needJoinFund && fundId) {
      navigate(`/invite/${fundId}`, { replace: true });
    }
  }, [needJoinFund, fundId, navigate]);

  // Auto-navigate to first fund
  useEffect(() => {
    if (selectedFund && !fundId) {
      navigate(`/chat/${selectedFund.id}`, { replace: true });
    }
  }, [selectedFund, fundId, navigate]);

  // Logic: Check if data is still loading
  const isInitialLoading = isLoadingFunds || !walletsData;

  // Logic: Check onboarding status
  const hasWallets = walletsData?.data && walletsData.data.length > 0;
  const hasFunds = fundList?.data && fundList.data.length > 0;
  const needsOnboarding = !hasWallets || !hasFunds;

  // If initial data is still loading, show loading screen
  if (isInitialLoading) {
    return <LoadingScreenZen isLoading={true} />;
  }

  // If user needs onboarding, show welcome screen
  if (needsOnboarding) {
    return (
      <ScreenWelcome
        userName={currentUserName || undefined}
        walletData={walletsData}
        onWalletMutate={mutateWallets}
        onCreateFund={async (name, type) => {
          await createFund({ name, type });
          await mutateList();
        }}
        currentUserId={currentUserId || undefined}
        allUsers={currentUser ? [currentUser] : []}
        onComplete={async () => {
          await mutateList();
          await mutateWallets();
          localStorage.setItem("mustCreateWallet", "false");
          localStorage.setItem("mustCreateFund", "false");
          localStorage.setItem("has_onboarded", "true");
          sessionStorage.removeItem("justLoggedIn");
        }}
        onLogout={logout}
        funds={fundList?.data || []}
        isLoadingFunds={isLoadingFunds}
      />
    );
  }

  // --- HANDLERS (Fund-level only, Message handlers moved to MessagePage) ---
  const handleSelectFund = (selectedFundId: string) => {
    navigate(`/chat/${selectedFundId}`);
  };

  const handleCreateFund = async (
    name: string,
    type: "personal" | "shared",
  ) => {
    const newFund = await createFund({ name, type });
    navigate(`/chat/${newFund.id}`);
  };

  const handleUpdateFund = async (
    id: string,
    name: string,
    type: "personal" | "shared"
  ) => {
    await updateFund(id, { name, type });
  };

  const handleDeleteFund = async (id: string) => {
    const success = await deleteFund(id);
    if (success && fundId === id) {
      const remainingFunds = fundList?.data.filter((f) => f.id !== id);
      if (remainingFunds.length > 0) {
        navigate(`/chat/${remainingFunds[0].id}`, { replace: true });
      } else {
        navigate("/chat", { replace: true });
      }
    }
  };

  // Load more funds
  const handleLoadMoreFunds = async () => {
    if (!fundList?.data || fundList.data.length >= fundList.total) return;
    setFundParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const hasMoreFunds = fundList?.total
    ? fundList.data.length < fundList.total
    : false;

  return (
    <MessagePage
      fund={selectedFund || fund}
      funds={accessibleFunds}
      onSelectFund={handleSelectFund}
      onCreateFund={(name, type) => handleCreateFund(name, type)}
      onUpdateFund={handleUpdateFund}
      onDeleteFund={handleDeleteFund}
      onSearchFunds={async (numberId) => {
        if (!numberId) return;
        try {
          await getFundSearchNumberId(numberId);
        } catch (error) {
          toast.error("Không tìm thấy quỹ");
        }
      }}
      onLogout={logout}
      isLoadingFunds={isLoadingFunds}
      isLoadingMoreFunds={false}
      hasMoreFunds={hasMoreFunds}
      onLoadMoreFunds={handleLoadMoreFunds}
    />
  );
}
