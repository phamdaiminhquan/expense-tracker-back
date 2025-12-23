import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Fund, Message } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { 
  MagnifyingGlass, 
  X, 
  Plus, 
  Wallet, 
  Users, 
  SignOut,
  ChatCircle,
  CaretRight,
  DotsThree
} from '@phosphor-icons/react'
import { useDebounce } from '@/hooks/useDebounce'

interface RecentChat {
  fundId: string
  fundName: string
  lastMessage: {
    id: string
    text: string
    timestamp: number
    processedAt?: number | null
  } | null
}

interface NavigationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funds: Fund[]
  messages: Message[]
  currentUserId: string
  currentUserName: string
  currentFundId: string | null
  isLoadingFunds?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  onSelectFund: (fundId: string) => void
  onCreateFund: () => void
  onLoadMore: () => void
  onLogout: () => void
  resolveUserName: (userId: string) => string
}

export function NavigationDrawer({
  open,
  onOpenChange,
  funds,
  messages,
  currentUserId,
  currentUserName,
  currentFundId,
  isLoadingFunds = false,
  isLoadingMore = false,
  hasMore = false,
  onSelectFund,
  onCreateFund,
  onLoadMore,
  onLogout,
  resolveUserName,
}: NavigationDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 200)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Get recent chats: Hiển thị tất cả funds (có hoặc chưa có message)
  const recentChats = useMemo<RecentChat[]>(() => {
    return funds.map(fund => ({
      fundId: fund.id,
      fundName: fund.name,
      lastMessage: fund.lastMessage || null,
    }))
  }, [funds])

  // Scroll detection để load more khi đạt 70%
  useEffect(() => {
    if (!open || !hasMore || isLoadingMore) return

    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

      if (scrollPercentage >= 0.7 && !isLoadingMore && hasMore) {
        onLoadMore()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [open, hasMore, isLoadingMore, onLoadMore])

  // Filter funds and chats based on search
  const filteredData = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) {
      return {
        funds: funds,
        chats: recentChats,
      }
    }

    const filteredFunds = funds.filter(fund =>
      fund.name.toLowerCase().includes(query)
    )

    const filteredChats = recentChats.filter(chat =>
      chat.fundName.toLowerCase().includes(query) ||
      (chat.lastMessage && chat.lastMessage.text.toLowerCase().includes(query))
    )

    return {
      funds: filteredFunds,
      chats: filteredChats,
    }
  }, [debouncedSearch, funds, recentChats])

  const handleSelectFund = useCallback((fundId: string) => {
    onSelectFund(fundId)
    onOpenChange(false)
  }, [onSelectFund, onOpenChange])

  const handleCreateFund = useCallback(() => {
    onCreateFund()
    onOpenChange(false)
  }, [onCreateFund, onOpenChange])

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua'
    } else {
      const day = date.getDate()
      const month = date.getMonth() + 1
      return `${day}/${month}`
    }
  }

  const truncateMessage = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[85%] sm:w-[400px] p-0 flex flex-col overflow-hidden"
      >
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass 
              size={20} 
              weight="bold" 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Tìm kiếm quỹ và chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 h-12 rounded-xl bg-muted/50 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-muted"
              >
                <X size={16} weight="bold" />
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {/* Funds Section */}
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Quỹ
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateFund}
                className="h-8 px-3 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
              >
                <Plus size={14} weight="bold" className="mr-1.5" />
                Mới
              </Button>
            </div>

            {isLoadingFunds ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredData.funds.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {debouncedSearch ? 'Không tìm thấy quỹ nào' : 'Chưa có quỹ nào'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredData.funds.map((fund) => {
                  const isActive = fund.id === currentFundId
                  return (
                    <button
                      key={fund.id}
                      onClick={() => handleSelectFund(fund.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-primary/20'
                          : 'bg-muted'
                      }`}>
                        {fund.type === 'shared' ? (
                          <Users size={24} className="text-primary" weight="duotone" />
                        ) : (
                          <Wallet size={24} className="text-primary" weight="duotone" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm truncate ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {fund.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {fund.memberIds.length} thành viên
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Chats Section */}
          {!debouncedSearch && recentChats.length > 0 && (
            <div className="px-5 py-4 space-y-4 border-t border-border/40">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Chat gần đây
              </h2>
              <div className="space-y-2">
                {recentChats.map((chat) => {
                  const isActive = chat.fundId === currentFundId
                  const hasMessage = chat.lastMessage !== null
                  return (
                    <button
                      key={chat.fundId}
                      onClick={() => handleSelectFund(chat.fundId)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <ChatCircle size={20} className="text-muted-foreground" weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold text-sm truncate ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}>
                            {chat.fundName}
                          </h3>
                          {hasMessage && (
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                              {formatDate(chat.lastMessage!.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs line-clamp-2 ${
                          hasMessage 
                            ? 'text-muted-foreground' 
                            : 'text-muted-foreground/60 italic'
                        }`}>
                          {hasMessage 
                            ? truncateMessage(chat.lastMessage!.text, 60)
                            : 'Chưa có tin nhắn nào'
                          }
                        </p>
                      </div>
                    </button>
                  )
                })}
                
                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Results - Chats */}
          {debouncedSearch && filteredData.chats.length > 0 && (
            <div className="px-5 py-4 space-y-4 border-t border-border/40">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Kết quả tìm kiếm - Chat
              </h2>
              <div className="space-y-2">
                {filteredData.chats.map((chat) => {
                  const isActive = chat.fundId === currentFundId
                  const hasMessage = chat.lastMessage !== null
                  return (
                    <button
                      key={chat.fundId}
                      onClick={() => handleSelectFund(chat.fundId)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <ChatCircle size={20} className="text-muted-foreground" weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold text-sm truncate ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}>
                            {chat.fundName}
                          </h3>
                          {hasMessage && (
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                              {formatDate(chat.lastMessage!.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs line-clamp-2 ${
                          hasMessage 
                            ? 'text-muted-foreground' 
                            : 'text-muted-foreground/60 italic'
                        }`}>
                          {hasMessage 
                            ? truncateMessage(chat.lastMessage!.text, 60)
                            : 'Chưa có tin nhắn nào'
                          }
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {debouncedSearch && filteredData.funds.length === 0 && filteredData.chats.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-muted-foreground">Không tìm thấy kết quả</p>
            </div>
          )}
        </div>

        {/* Footer - Account */}
        <div className="px-5 py-4 border-t border-border/40 bg-muted/30">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-all text-left"
          >
            <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/30 to-primary/15 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/15 text-primary font-bold">
                {getInitials(currentUserName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{currentUserName}</p>
              <p className="text-xs text-muted-foreground">Tài khoản</p>
            </div>
            <SignOut size={20} className="text-muted-foreground shrink-0" weight="bold" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

