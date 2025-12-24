import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Fund, Message } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { 
  Plus, 
  Wallet, 
  Users, 
  SignOut,
  ChatCircle,
} from '@phosphor-icons/react'
import { ButtonIconElement } from './components/elements/button/button-icon.element'
import { StackRowAlignCenter } from './components/styles/stack.style'
import { TextFieldSearchElement } from './components/elements/text-field/text-field-search.element'

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
  onDeleteFund: (fundId: string) => Promise<void>
  onSelectFund: (fundId: string) => void
  onCreateFund: () => void
  onUpdateFund: (fundId: string) => void
  onLoadMore: () => void
  onLogout: () => void
  resolveUserName: (userId: string) => string
  onSearchFunds?: (query: string) => void
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
  onDeleteFund,
  onSelectFund,
  onCreateFund,
  onUpdateFund,
  onLoadMore,
  onLogout,
  resolveUserName,
  onSearchFunds,
}: NavigationDrawerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const handleSelectFund = useCallback((fundId: string) => {
    onSelectFund(fundId)
    onOpenChange(false)
  }, [onSelectFund, onOpenChange])

  const handleCreateFund = useCallback(() => {
    onCreateFund()
    onOpenChange(false)
  }, [onCreateFund, onOpenChange])

  const handleUpdateFund = useCallback((fundId: string) => {
    onUpdateFund(fundId)
    onOpenChange(false)
  }, [onUpdateFund, onOpenChange])

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[85%] sm:w-[400px] p-0 flex flex-col overflow-hidden"
      >
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40">
          {/* Search */}
          <TextFieldSearchElement sx={{mt: 2}} onChange={(e) => onSearchFunds?.(e.target.value || '')} />
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
            ) : funds.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
              </div>
            ) : (
              <div className="space-y-2">
                {funds.map((fund) => {
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
                      <StackRowAlignCenter sx={{ gap: 0 }}>
                        <ButtonIconElement icon="delete" onClick={() => onDeleteFund(fund.id)} />
                        <ButtonIconElement onClick={() => handleUpdateFund(fund.id)} icon="edit_document" />
                      </StackRowAlignCenter>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

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

