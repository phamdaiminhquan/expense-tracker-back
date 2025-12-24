import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFunds } from '@/hooks/useFunds'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { MessagePage } from '@/pages/MessagePage'
import { toast } from 'sonner'

export function MessageRoute() {
  // hook
  const { fundId } = useParams()
  const navigate = useNavigate()
  const { 
    visibleFunds, 
    enterFund, 
    createFund, 
    updateFund,
    deleteFund,
    fetchFunds, 
    loadMoreFunds,
    isLoading: isLoadingFunds,
    isLoadingMore: isLoadingMoreFunds,
    hasMore: hasMoreFunds,
  } = useFunds()
  const { currentUserId, currentUserName, currentUser, resolveUserName, logout } = useAuth()
  const {
    addMessage,
    resendMessage,
    updateMessage,
    deleteMessage,
    fetchMessagesByFund,
    messages,
    isProcessing,
    isLoading,
  } = useMessages()
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories()

  // state
    const [screenState, setScreenState] = useState({
    params: {
      page: 1,
      take: 10,
      search: undefined as string | undefined,
    }
  })
  // function
  useEffect(() => {
    fetchFunds(screenState.params)
  }, [screenState.params])

  // Auto-select fund đầu tiên nếu chưa có fundId
  const fund = useMemo(() => {
    if (fundId) {
      return visibleFunds.find((f) => f.id === fundId) || null
    }
    // Luôn chọn fund đầu tiên (BE đã sort theo mới nhất)
    return visibleFunds.length > 0 ? visibleFunds[0] : null
  }, [fundId, visibleFunds])

  useEffect(() => {
    if (fund && !fundId) {
      // Auto-navigate đến fund đầu tiên nếu chưa có fundId
      navigate(`/chat/${fund.id}`, { replace: true })
    } else if (fund) {
      enterFund(fund)
      // Update URL if fund changed
      if (fundId !== fund.id) {
        navigate(`/chat/${fund.id}`, { replace: true })
      }
    }
  }, [fund, enterFund, fundId, navigate])

  useEffect(() => {
    if (fund) {
      fetchMessagesByFund(fund.id)
    }
  }, [fund, fetchMessagesByFund])

  const handleSelectFund = (selectedFundId: string) => {
    navigate(`/chat/${selectedFundId}`)
  }

  const handleCreateFundComplete = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    try {
      const newFund = await createFund(name, type, memberIds)
      toast.success('Đã tạo quỹ thành công!', { description: name })
      navigate(`/chat/${newFund.id}`)
    } catch (error) {
      console.error(error)
      toast.error('Tạo quỹ thất bại', { description: 'Vui lòng thử lại' })
      throw error
    }
  }

  const handleUpdateFundComplete = async (id: string, name: string, type: 'personal' | 'shared') => {
    try {
      await updateFund(id, name, type)
      toast.success('Cập nhật quỹ thành công!', { description: name })
    } catch (error) {
      console.error(error)
      toast.error('Cập nhật quỹ thất bại', { description: 'Vui lòng thử lại' })
      throw error
    }
  }

  const handleDeleteFundComplete = async (id: string) => {
    try {
      await deleteFund(id)
      toast.success('Đã xóa quỹ thành công!')
    } catch (error) {
      console.error(error)
      toast.error('Xóa quỹ thất bại', { description: 'Vui lòng thử lại' })
      throw error
    }
  }

  return (
    <MessagePage
      fund={fund}
      funds={visibleFunds}
      messages={messages}
      categories={categories}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      currentUser={currentUser}
      resolveUserName={resolveUserName}
      onSelectFund={handleSelectFund}
      onCreateFund={handleCreateFundComplete}
      onUpdateFund={handleUpdateFundComplete}
      onDeleteFund={handleDeleteFundComplete}
      onLogout={logout}
      onAddMessage={addMessage}
      onResendMessage={resendMessage}
      onUpdateMessage={updateMessage}
      onDeleteMessage={deleteMessage}
      onCreateCategory={(name, description) => createCategory(fund?.id || null, name, description)}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
      isProcessing={isProcessing}
      isLoading={isLoading}
      isLoadingFunds={isLoadingFunds}
      isLoadingMoreFunds={isLoadingMoreFunds}
      hasMoreFunds={hasMoreFunds}
      onLoadMoreFunds={loadMoreFunds}
      onSearchFunds={(query) => {
        setScreenState((prev) => ({
          ...prev,
          params: {
            ...prev.params,
            search: query,
            page: 1,
          }
        }))
      }}
    />
  )
}
