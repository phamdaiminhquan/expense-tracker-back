import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { MessagePage } from '@/pages/message/MessagePage';
import { PAGE_TAKE_DEFAULT } from '@/common/constant/page-take.constant';
import { useFund } from '@/app/providers/FundProvider';

export function MessageRoute() {
  const { fundId } = useParams();
  const navigate = useNavigate();
  const { currentUserId, currentUserName, currentUser, resolveUserName, logout } = useAuth();

  // State for pagination
  const [params, setParams] = useState({
    ...PAGE_TAKE_DEFAULT,
    page: 1,
    take: 10,
  });

  // Use fund hook
  const {
    funds,
    total,
    fund,
    isLoadingList: isLoadingFunds,
    isLoadingFund,
    loading: isFundProcessing,
    createFund,
    updateFund,
    deleteFund,
    mutateList: refetchFunds,
  } = useFund(params, fundId);

  // Use messages hook
  const {
    addMessage,
    resendMessage,
    updateMessage,
    deleteMessage,
    fetchMessagesByFund,
    messages,
    isProcessing,
    isLoading,
  } = useMessages();
  // Use categories hook
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();

  // Get visible funds (filter by access permission)
  const visibleFunds = useMemo(() => {
    if (!funds || !currentUserId) return [];
    return funds?.filter((f) => 
      f.ownerId === currentUserId || f.memberIds.includes(currentUserId)
    );
  }, [currentUserId, funds]);

  // Auto-select fund
  const selectedFund = useMemo(() => {
    if (fundId && fund) {
      return fund;
    }
    // Auto-select first fund if no fundId
    return visibleFunds.length > 0 ? visibleFunds[0] : null;
  }, [fundId, fund, visibleFunds]);

  // Auto-navigate to first fund
  useEffect(() => {
    if (selectedFund && !fundId) {
      navigate(`/chat/${selectedFund.id}`, { replace: true });
    }
  }, [selectedFund, fundId, navigate]);

  // Fetch messages when fund changes
  useEffect(() => {
    if (selectedFund) {
      fetchMessagesByFund(selectedFund.id);
    }
  }, [selectedFund, fetchMessagesByFund]);

  // Handle select fund
  const handleSelectFund = (selectedFundId: string) => {
    navigate(`/chat/${selectedFundId}`);
  };

  // Handle create fund
  const handleCreateFund = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    const newFund = await createFund({ name, type, memberIds });
    navigate(`/chat/${newFund.id}`);
  };

  // Handle update fund
  const handleUpdateFund = async (id: string, name: string, type: 'personal' | 'shared') => {
    await updateFund(id, { name, type });
  };

  // Handle delete fund
  const handleDeleteFund = async (id: string) => {
    const success = await deleteFund(id);
    if (success && fundId === id) {
      // Navigate to first available fund after deletion
      const remainingFunds = visibleFunds.filter((f) => f.id !== id);
      if (remainingFunds.length > 0) {
        navigate(`/chat/${remainingFunds[0].id}`, { replace: true });
      } else {
        navigate('/chat', { replace: true });
      }
    }
  };

  // Load more funds
  const handleLoadMoreFunds = async () => {
    if (!total || funds.length >= total) return;
    setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const hasMoreFunds = total ? funds.length < total : false;

  return (
    <MessagePage
      fund={selectedFund}
      funds={visibleFunds}
      messages={messages}
      categories={categories}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      currentUser={currentUser}
      resolveUserName={resolveUserName}
      onSelectFund={handleSelectFund}
      onCreateFund={handleCreateFund}
      onUpdateFund={handleUpdateFund}
      onDeleteFund={handleDeleteFund}
        onSearchFunds={(prev) => setParams((p) => ({ ...p, search: prev, page: 1 }))}
      onLogout={logout}
      onAddMessage={addMessage}
      onResendMessage={resendMessage}
      onUpdateMessage={updateMessage}
      onDeleteMessage={deleteMessage}
      onCreateCategory={(name, description) => createCategory(selectedFund?.id || null, name, description)}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
      isProcessing={isProcessing || isFundProcessing}
      isLoading={isLoading || isLoadingFund}
      isLoadingFunds={isLoadingFunds}
      isLoadingMoreFunds={false}
      hasMoreFunds={hasMoreFunds}
      onLoadMoreFunds={handleLoadMoreFunds}
    />
  );
}
