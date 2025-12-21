import { useState } from 'react'
import { Message, Fund, Category } from '@/lib/types'
import { FundStatisticsDialog } from '@/components/FundStatisticsDialog'
import { CategoryManagementDialog } from '@/components/CategoryManagementDialog'
import { ChatMessageView } from '@/components/ChatMessageView'
import React from 'react'

interface MessagePageProps {
  fund: Fund
  messages: Message[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  resolveUserName: (userId: string) => string
  onBack: () => void
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>
  onResendMessage: (message: Message) => Promise<void>
  onUpdateMessage: (message: Message) => Promise<void>
  onDeleteMessage: (id: string) => Promise<void>
  onCreateCategory: (name: string, description: string) => void
  onUpdateCategory: (categoryId: string, name: string, description: string) => void
  onDeleteCategory: (categoryId: string) => void
  isProcessing?: boolean
  isLoading?: boolean
}

export function MessagePage({
  fund,
  messages,
  categories,
  currentUserId,
  currentUserName,
  resolveUserName,
  onBack,
  onAddMessage,
  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isProcessing = false,
  isLoading = false,
}: MessagePageProps) {
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)

  return (
    <React.Fragment>
      <ChatMessageView
        fund={fund}
        messages={messages}
        categories={categories}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        onBack={onBack}
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

      <FundStatisticsDialog
        open={isStatisticsDialogOpen}
        onOpenChange={setIsStatisticsDialogOpen}
        messages={messages}
        categories={categories}
        fund={fund}
        resolveUserName={resolveUserName}
      />

      <CategoryManagementDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        categories={categories}
        messages={messages}
        onCreateCategory={onCreateCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </React.Fragment>
  )
}
