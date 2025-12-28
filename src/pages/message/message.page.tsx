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
import { TrendingUp, X } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'

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
      // Set showLoadingScreen = false để hiển thị nội dung
      setShowLoadingScreen(false)
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
      {/* Container: p-0 trên mobile, p-3 trên desktop */}
      <div className={`flex h-[100dvh] lg:h-screen overflow-hidden bg-[#F0F2F5] lg:p-3 lg:gap-3 p-0 gap-0 ${showLoadingScreen ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        
        {/* CỘT 1: SIDEBAR LEFT - Chỉ hiện trên lg, giữ nguyên card style vì là desktop */}
        <aside className="hidden lg:flex w-[350px] bg-white flex-col shrink-0 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
           <NavigationDrawer
              open={true}
              onOpenChange={() => {}}
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
              isPermanent={true}
            />
        </aside>

        {/* DRAWER CHO MOBILE/TABLET */}
        <div className="lg:hidden">
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
        </div>

        {/* CỘT 2: CHAT MAIN VIEW - Bo góc trên desktop, tràn viền trên mobile */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 shadow-none border-none overflow-hidden relative">
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
            onSelectFund={onSelectFund}
            funds={funds}
          />
        </main>

        {/* CỘT 3: STATISTIC VIEW - Giữ nguyên card style trên desktop */}
        <aside className="hidden xl:flex w-[380px] bg-white flex-col shrink-0 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
           <div className="p-8 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Thống kê chi tiết</h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-4">
                 <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-500 shadow-inner">
                    <TrendingUp size={48} />
                 </div>
                 <div>
                    <p className="font-bold text-gray-800 text-lg">Đang phát triển</p>
                    <p className="text-sm text-gray-400 leading-relaxed">Tính năng phân tích chi tiêu thông minh bằng AI sẽ sớm có mặt để phục vụ bạn.</p>
                 </div>
              </div>
           </div>
        </aside>

        {/* DRAWER CHO MOBILE/TABLET (SIDEBAR RIGHT / STATISTIC) */}
        <Sheet open={isStatisticsDialogOpen} onOpenChange={setIsStatisticsDialogOpen}>
          <SheetContent side="right" className="w-[85%] sm:w-[450px] p-0 border-none shadow-2xl bg-white">
             {fund && (
                <div className="h-full flex flex-col p-8">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold text-gray-800">Thống kê: {fund.name}</h2>
                      <button onClick={() => setIsStatisticsDialogOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </button>
                   </div>
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500">
                         <TrendingUp size={40} />
                      </div>
                      <p className="text-sm text-gray-500 max-w-[200px]">Phần này sẽ hiển thị biểu đồ và phân tích giao dịch của {fund.name}.</p>
                   </div>
                </div>
             )}
          </SheetContent>
        </Sheet>


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
