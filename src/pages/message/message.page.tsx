import { useState, useEffect, useRef } from 'react'
import { Message,  Category } from '@/lib/types'
import { FundStatisticsDialog } from '@/components/FundStatisticsDialog'
// import { CategoryManagementDialog } from '@/components/CategoryManagementDialog'
import { CategorySubscriptionDialog } from '@/components/CategorySubscriptionDialog'

import { ChatMessageView } from '@/pages/message/parts/message-chat/message-chat.part'
import { NavigationDrawer } from '@/components/NavigationDrawer'
import { CreateFundDialog } from '@/pages/fund/parts/fund-create/fund-create.part'
import React from 'react'
import { UpdateFundDialog } from '../fund/parts/fund-update/fund-update.part'
import { Fund } from '@/apis/funds/fund.entities'

interface MessagePageProps {
  fund: Fund | null
  funds: Fund[]
  messages: Message[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  currentUser: any
  resolveUserName: (userId: string) => string
  onSelectFund: (fundId: string) => void
  onCreateFund: (name: string, type: 'personal' | 'shared', memberIds: string[]) => Promise<void>
  onUpdateFund: (fundId: string, name: string, type: 'personal' | 'shared') => Promise<void>
  onDeleteFund: (fundId: string) => Promise<void>
  onLogout: () => void
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>
  onResendMessage: (message: Message) => Promise<void>
  onUpdateMessage: (message: Message) => Promise<void>
  onDeleteMessage: (id: string) => Promise<void>
  onCreateCategory: (name: string, description: string) => void
  onUpdateCategory: (categoryId: string, name: string, description: string) => void
  onDeleteCategory: (categoryId: string) => void
  isProcessing?: boolean
  isLoading?: boolean
  isLoadingFunds?: boolean
  isLoadingMoreFunds?: boolean
  hasMoreFunds?: boolean
  onLoadMoreFunds?: () => void
  onSearchFunds?: (query: string) => void
}

export function MessagePage({
  fund,
  funds,
  messages,
  categories,
  currentUserId,
  currentUserName,
  currentUser,
  resolveUserName,
  onSelectFund,
  onCreateFund,
  onUpdateFund,
  onDeleteFund,
  onLogout,
  onAddMessage,
  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isProcessing = false,
  isLoading = false,
  isLoadingFunds = false,
  isLoadingMoreFunds = false,
  hasMoreFunds = false,
  onLoadMoreFunds,
  onSearchFunds,
}: MessagePageProps) {
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isCategorySubscriptionOpen, setIsCategorySubscriptionOpen] = useState(false)
  const [isAutoCategorySubscription, setIsAutoCategorySubscription] = useState(false)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false)
  const [isUpdateFundDialogOpen, setIsUpdateFundDialogOpen] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const hasShownInitialBanner = useRef(false)

  // Hiển thị banner khi đang load funds (lần đầu vào app)
  useEffect(() => {
    if (hasShownInitialBanner.current) return

    // Chỉ hiển thị lần đầu khi vào app và đang load funds
    const hasSeenBanner = sessionStorage.getItem('hasSeenChatBanner')
    if (!hasSeenBanner && isLoadingFunds) {
      hasShownInitialBanner.current = true
      setShowLoadingScreen(true)
      sessionStorage.setItem('hasSeenChatBanner', 'true')
    }
  }, [isLoadingFunds])

  // Tự động ẩn banner khi load xong (không cần user action)
  useEffect(() => {
    if (showLoadingScreen && !isLoadingFunds) {
      // LoadingScreen sẽ tự xử lý minimum display time và fade out
    }
  }, [showLoadingScreen, isLoadingFunds])

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
  }

  const handleOpenCreateFund = () => {
    setIsCreateFundDialogOpen(true)
    setIsDrawerOpen(false)
  }

  const handleOpenUpdateFund = () => {
    setIsUpdateFundDialogOpen(true)
    setIsDrawerOpen(false)
  }

  const handleCreateFundComplete = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    await onCreateFund(name, type, memberIds)
    setIsCreateFundDialogOpen(false)
  }
  const handleUpdateFundComplete = async (id: string, name: string, type: 'personal' | 'shared') => {
    await onUpdateFund(id, name, type)
    setIsUpdateFundDialogOpen(false)
  }

  const fundCategories = fund ? categories.filter((c) => c.fundId === fund.id) : []
  const fundMessages = fund ? messages.filter((m) => m.fundId === fund.id) : []
  useEffect(() => {
    if (!fund?.id) return
    if (fund.isOpenDialogCate) {
      setIsAutoCategorySubscription(true)
      setIsCategorySubscriptionOpen(true)
    }
  }, [fund?.id, fund?.isOpenDialogCate])



  // Banner chỉ hiển thị khi đang load funds lần đầu
  const isInitialLoading = isLoadingFunds

  return (
    <React.Fragment>
      <div className={showLoadingScreen ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500 pointer-events-auto'}>
        <NavigationDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          funds={funds}
          onDeleteFund={onDeleteFund}
          currentUserName={currentUserName}
          currentFundId={fund?.id || null}
          isLoadingFunds={isLoadingFunds}
          isLoadingMore={isLoadingMoreFunds}
          hasMore={hasMoreFunds}
          onSelectFund={onSelectFund}
          onCreateFund={handleOpenCreateFund}
          onUpdateFund={handleOpenUpdateFund}
          onLoadMore={onLoadMoreFunds || (() => { })}
          onLogout={onLogout}
          onSearchFunds={onSearchFunds}
        />

        <ChatMessageView
          fund={fund}
          messages={fundMessages}
          categories={fundCategories}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onShowStatistics={() => setIsStatisticsDialogOpen(true)}
          onManageCategories={() => setIsCategoryDialogOpen(true)}
          onShowCategorySubscription={() => {
            setIsAutoCategorySubscription(false)
            setIsCategorySubscriptionOpen(true)
          }}
          onAddMessage={onAddMessage}
          onResendMessage={onResendMessage}
          onUpdateMessage={onUpdateMessage}
          onDeleteMessage={onDeleteMessage}
          resolveUserName={resolveUserName}
          isProcessing={isProcessing}
          isLoading={isLoading}
          isLoadingFunds={isLoadingFunds}
        />


        {fund && (
          <>
            <FundStatisticsDialog
              open={isStatisticsDialogOpen}
              onOpenChange={setIsStatisticsDialogOpen}
              // messages={fundMessages}
              categories={fundCategories}
              fund={fund}
              resolveUserName={resolveUserName}
            />

            {/* <CategoryManagementDialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
            categories={fundCategories}
            messages={fundMessages}
            onCreateCategory={onCreateCategory}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategory={onDeleteCategory}
          /> */}

            <CategorySubscriptionDialog
              open={isCategorySubscriptionOpen}
              onOpenChange={(nextOpen) => {
                setIsCategorySubscriptionOpen(nextOpen)
                if (!nextOpen && isAutoCategorySubscription) {
                  setIsAutoCategorySubscription(false)
                }
              }}
              fundId={fund.id}
              onSkip={() => {
                setIsAutoCategorySubscription(false)
                setIsCategorySubscriptionOpen(false)
              }}
            />
          </>
        )}


        <CreateFundDialog
          open={isCreateFundDialogOpen}
          onOpenChange={setIsCreateFundDialogOpen}
          onCreateFund={handleCreateFundComplete}
          currentUserId={currentUserId}
          allUsers={currentUser ? [currentUser] : []}
        />

          <UpdateFundDialog
          fund={fund!}
          open={isUpdateFundDialogOpen}
          onOpenChange={setIsUpdateFundDialogOpen}
          onUpdateFund={handleUpdateFundComplete}
          currentUserId={currentUserId}
          allUsers={currentUser ? [currentUser] : []}
        />
      </div>
    </React.Fragment>
  )
}
