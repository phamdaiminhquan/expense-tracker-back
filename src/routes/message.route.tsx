import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories.hook";
import { useAuth } from "@/hooks/use-auth.hook";
import { MessagePage } from "@/pages/message/message.page";
import { PAGE_TAKE_DEFAULT } from "@/common/constant/page-take.constant";
import { useFund } from "@/app/providers/FundProvider";
import { useMessage } from "@/app/providers/MessageProvider";
import { useAppReady } from "@/contexts/app-ready.context";
import {
  getFund,
  getFundSearchNumberId,
  joinFundRequest,
} from "@/apis/funds/fund.api";
import { getListWallets } from "@/apis/wallets/wallet.api";
import { toast } from "sonner";
import useSWR from "swr";
import LoadingScreenZen from "@/components/elements/screen/screen-loading-zen.element";
import { ScreenWelcome } from "@/components/elements/screen/screen-welcome.element";

export function MessageRoute() {
  // hook
  const { fundId } = useParams();
  const navigate = useNavigate();

  const {
    currentUserId,
    currentUserName,
    currentUser,
    resolveUserName,
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

  const canLoadMessages = !!selectedFund && !!selectedFund.id;

  const {
    messageList,
    isLoadingList: isLoadingMessages,
    loading: isProcessingMessage,
    createMessage,
    updateMessage,
    deleteMessage,
  } = useMessage(canLoadMessages ? selectedFund.id : undefined);

  const { categories } = useCategories();

  // Fetch wallets data for onboarding check
  const { data: walletsData, mutate: mutateWallets } = useSWR(
    "onboarding-wallets",
    async () => await getListWallets({ page: 1, take: 10 }),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  // Signal app ready khi đã có data (hoặc đã load xong dù empty)
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
          // Clear the onboarding flags
          localStorage.setItem("mustCreateWallet", "false");
          localStorage.setItem("mustCreateFund", "false");
          localStorage.setItem("has_onboarded", "true");
          // Remove the justLoggedIn flag from session
          sessionStorage.removeItem("justLoggedIn");
        }}
        onLogout={logout}
        funds={fundList?.data || []}
        isLoadingFunds={isLoadingFunds}
      />
    );
  }

  // Handle select fund
  const handleSelectFund = (selectedFundId: string) => {
    navigate(`/chat/${selectedFundId}`);
  };

  const handleCreateFund = async (
    name: string,
    type: "personal" | "shared",
    memberIds: string[]
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

  const handleAddMessage = async (messageData: any) => {
    if (!selectedFund) return;

    // Only send the fields required by the API: message and walletId (provided by UI)
    const payload = {
      message: messageData.message || null,
      walletId: messageData.walletId ?? null,
    };

    await createMessage(selectedFund.id, payload);
  };

  const handleResendMessage = async (failedMessage: any, walletId?: string) => {
    if (!selectedFund) return;

    const messageText = failedMessage.originalPrompt || failedMessage.message;
    const payload = {
      message: messageText,
      walletId: walletId ?? failedMessage.walletId ?? null,
    };

    await createMessage(selectedFund.id, payload);
  };

  const handleUpdateMessage = async (updatedMessage: any) => {
    // Manually updating message details
    const payload: any = {
      message: updatedMessage.message,
      walletId: updatedMessage.walletId ?? null,
      spendValue: updatedMessage.spend,
      earnValue: updatedMessage.earn,
      categoryId: updatedMessage.categoryId,
    };

    await updateMessage(updatedMessage.id, payload);
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
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
      messages={messageList?.data || []}
      categories={categories}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      currentUser={currentUser}
      onSelectFund={handleSelectFund}
      onCreateFund={(name, type) =>
        handleCreateFund(name, type, [currentUserId as string])
      }
      onUpdateFund={handleUpdateFund}
      onDeleteFund={handleDeleteFund}
      // onSearchFunds={(prev) => setFundParams((p) => ({ ...p, search: prev, page: 1 }))}
      onSearchFunds={async (numberId) => {
        if (!numberId) return;
        try {
          await getFundSearchNumberId(numberId);
        } catch (error) {
          toast.error("Không tìm thấy quỹ");
        }
      }}
      onLogout={logout}
      onAddMessage={handleAddMessage}
      onResendMessage={handleResendMessage}
      onUpdateMessage={handleUpdateMessage}
      onDeleteMessage={handleDeleteMessage}
      // onCreateCategory={(name, description) =>
      //   createCategory(selectedFund?.id || null, name, description)
      // }
      // onUpdateCategory={updateCategory}
      // onDeleteCategory={deleteCategory}
      isProcessing={isProcessingMessage || isFundProcessing}
      isLoading={isLoadingMessages || isLoadingFund}
      isLoadingFunds={isLoadingFunds}
      isLoadingMoreFunds={false}
      hasMoreFunds={hasMoreFunds}
      onLoadMoreFunds={handleLoadMoreFunds}
    />
  );
}
