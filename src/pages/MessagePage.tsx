import { useState } from 'react'
import { Message, Fund, Category } from '@/lib/types'
import { FundStatisticsDialog } from '@/components/FundStatisticsDialog'
import { CategoryManagementDialog } from '@/components/CategoryManagementDialog'
import { ChatMessageView } from '@/components/ChatMessageView'
import { NavigationDrawer } from '@/components/NavigationDrawer'
import { CreateFundDialog } from '@/components/CreateFundDialog'
import React from 'react'

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
}: MessagePageProps) {
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false)

  const handleOpenCreateFund = () => {
    setIsCreateFundDialogOpen(true)
    setIsDrawerOpen(false)
  }

  const handleCreateFundComplete = async (name: string, type: 'personal' | 'shared', memberIds: string[]) => {
    await onCreateFund(name, type, memberIds)
    setIsCreateFundDialogOpen(false)
  }

  const fundCategories = fund ? categories.filter((c) => c.fundId === fund.id) : []
  const fundMessages = fund ? messages.filter((m) => m.fundId === fund.id) : []

  return (
    <React.Fragment>
      <NavigationDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        funds={funds}
        messages={messages}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        currentFundId={fund?.id || null}
        isLoadingFunds={isLoadingFunds}
        isLoadingMore={isLoadingMoreFunds}
        hasMore={hasMoreFunds}
        onSelectFund={onSelectFund}
        onCreateFund={handleOpenCreateFund}
        onLoadMore={onLoadMoreFunds}
        onLogout={onLogout}
        resolveUserName={resolveUserName}
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
        onAddMessage={onAddMessage}
        onResendMessage={onResendMessage}
        onUpdateMessage={onUpdateMessage}
        onDeleteMessage={onDeleteMessage}
        resolveUserName={resolveUserName}
        isProcessing={isProcessing}
        isLoading={isLoading}
      />

      {fund && (
        <>
          <FundStatisticsDialog
            open={isStatisticsDialogOpen}
            onOpenChange={setIsStatisticsDialogOpen}
            messages={fundMessages}
            categories={fundCategories}
            fund={fund}
            resolveUserName={resolveUserName}
          />

          <CategoryManagementDialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
            categories={fundCategories}
            messages={fundMessages}
            onCreateCategory={onCreateCategory}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategory={onDeleteCategory}
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
    </React.Fragment>
  )
}
