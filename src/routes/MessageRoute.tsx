import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { MessagePage } from '@/pages/message/message.page';
import { PAGE_TAKE_DEFAULT } from '@/common/constant/page-take.constant';
import { useFund } from '@/app/providers/FundProvider';
import { useMessage } from '@/app/providers/MessageProvider';

export function MessageRoute() {
  // hook
  const { fundId } = useParams();
  const navigate = useNavigate();
  const { currentUserId, currentUserName, currentUser, resolveUserName, logout } = useAuth();

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
  } = useFund(fundParams, fundId);

  // Get visible funds (filter by access permission)
  const visibleFunds = useMemo(() => {
    if (!fundList?.data || !currentUserId) return [];
    return fundList.data.filter((f) => f.ownerId === currentUserId || f.memberIds?.includes(currentUserId));
  }, [currentUserId, fundList?.data]);

  // Auto-select fund
  const selectedFund = useMemo(() => {
    if (fundId && fund) return fund;
    return visibleFunds.length > 0 ? visibleFunds[0] : null;
  }, [fundId, fund, visibleFunds]);

  const {
    messageList,
    isLoadingList: isLoadingMessages,
    loading: isProcessingMessage,
    createMessage,
    updateMessage,
    deleteMessage,
  } = useMessage(selectedFund?.id || '');

  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();

  // Auto-navigate to first fund
  useEffect(() => {
    if (selectedFund && !fundId) {
      navigate(`/chat/${selectedFund.id}`, { replace: true });
    }
  }, [selectedFund, fundId, navigate]);

  // Handle select fund
  const handleSelectFund = (selectedFundId: string) => {
    navigate(`/chat/${selectedFundId}`);
  };

  const handleCreateFund = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    const newFund = await createFund({ name, type, memberIds });
    navigate(`/chat/${newFund.id}`);
  };

  const handleUpdateFund = async (id: string, name: string, type: 'personal' | 'shared') => {
    await updateFund(id, { name, type });
  };

  const handleDeleteFund = async (id: string) => {
    const success = await deleteFund(id);
    if (success && fundId === id) {
      const remainingFunds = visibleFunds.filter((f) => f.id !== id);
      if (remainingFunds.length > 0) {
        navigate(`/chat/${remainingFunds[0].id}`, { replace: true });
      } else {
        navigate('/chat', { replace: true });
      }
    }
  };

  const handleAddMessage = async (messageData: any) => {
    if (!selectedFund) return;

    const payload = {
      message: messageData.message || null,
    };

    await createMessage(selectedFund.id, payload);
  };

  const handleResendMessage = async (failedMessage: any) => {
    if (!selectedFund) return;

    const messageText = failedMessage.originalPrompt || failedMessage.message;
    const payload = {
      message: messageText,
    };

    await createMessage(selectedFund.id, payload);
  };

  const handleUpdateMessage = async (updatedMessage: any) => {
    const payload = {
      message: updatedMessage.message,
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

  const hasMoreFunds = fundList?.total ? fundList.data.length < fundList.total : false;
  return (
    <MessagePage
      fund={selectedFund}
      funds={visibleFunds}
      messages={messageList?.data || []}
      categories={categories}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      currentUser={currentUser}
      resolveUserName={resolveUserName}
      onSelectFund={handleSelectFund}
      onCreateFund={handleCreateFund}
      onUpdateFund={handleUpdateFund}
      onDeleteFund={handleDeleteFund}
      onSearchFunds={(prev) => setFundParams((p) => ({ ...p, search: prev, page: 1 }))}
      onLogout={logout}
      onAddMessage={handleAddMessage}
      onResendMessage={handleResendMessage}
      onUpdateMessage={handleUpdateMessage}
      onDeleteMessage={handleDeleteMessage}
      onCreateCategory={(name, description) => createCategory(selectedFund?.id || null, name, description)}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
      isProcessing={isProcessingMessage || isFundProcessing}
      isLoading={isLoadingMessages || isLoadingFund}
      isLoadingFunds={isLoadingFunds}
      isLoadingMoreFunds={false}
      hasMoreFunds={hasMoreFunds}
      onLoadMoreFunds={handleLoadMoreFunds}
    />
  );
}
