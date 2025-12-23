import { useState, useRef, useEffect } from 'react'
import { Message, Fund, Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  List,
  ChartBar,
  PaperPlaneRight,
  PencilSimple,
  Trash,
  ArrowClockwise,
  NotePencil,
  Users,
  CircleNotch,
  Tag,
  CheckCircle,
  XCircle,
  ArrowRight,
} from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/currency'
import { EditPendingPromptDialog } from './EditPendingPromptDialog'
import { EditMessageDialog } from './EditMessageDialog'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

interface ChatMessageViewProps {
  fund: Fund | null
  messages: Message[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  resolveUserName: (userId: string) => string
  onOpenDrawer: () => void
  onShowStatistics: () => void
  onManageCategories: () => void
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>
  onResendMessage: (message: Message) => Promise<void>
  onUpdateMessage: (message: Message) => Promise<void>
  onDeleteMessage: (id: string) => Promise<void>
  isProcessing?: boolean
  isLoading?: boolean
}

const ITEMS_PER_PAGE = 10

export function ChatMessageView({
  fund,
  messages,
  categories,
  currentUserId,
  currentUserName,
  resolveUserName,
  onOpenDrawer,
  onShowStatistics,
  onManageCategories,
  onAddMessage,
  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  isProcessing = false,
  isLoading = false,
}: ChatMessageViewProps) {
  const [input, setInput] = useState('')
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editingPendingPrompt, setEditingPendingPrompt] = useState<Message | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp)
  const visibleMessages = sortedMessages.slice(0, visibleCount)

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    // Logic to load previous pages when scrolling to the top
    if (container.scrollTop === 0 && visibleCount < sortedMessages.length) {
      const oldScrollHeight = container.scrollHeight
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedMessages.length))
      
      // Maintain scroll position after loading more items
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight
        container.scrollTop = newScrollHeight - oldScrollHeight
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !fund) return

    const messageText = input.trim()
    // Clear input immediately for better UX
    setInput('')

    try {
      await onAddMessage({
        userId: currentUserId,
        userName: currentUserName,
        fundId: fund.id,
        spend: null,
        earn: null,
        message: messageText,
        isPendingPrompt: true,
        originalPrompt: messageText,
        promptCreatedAt: Date.now(),
      })
    } catch (error) {
      // Error toast handled upstream
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

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

  const getMemberNames = () => {
    if (!fund) return ''
    return fund.memberIds.map((id) => resolveUserName(id)).join(', ')
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.01] to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.05),transparent_70%)]" />
      
      <header className="sticky top-0 z-20 bg-background/95 border-b border-border/40 shadow-lg">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenDrawer}
                className="h-11 w-11 hover:bg-muted/60 rounded-xl transition-all"
                aria-label="Open navigation"
              >
                <List size={22} weight="bold" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-xl truncate text-foreground">
                  {fund ? fund.name : 'Chọn quỹ để bắt đầu'}
                </h1>
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {fund ? (fund.type === 'shared' ? getMemberNames() : 'AI Bot') : 'Mở menu để chọn quỹ'}
                </p>
              </div>
            </div>
            {fund && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onManageCategories}
                  className="h-11 w-11 hover:bg-muted/60 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                >
                  <Tag size={22} weight="bold" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onShowStatistics}
                  className="h-11 w-11 hover:bg-muted/60 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                >
                  <ChartBar size={22} weight="bold" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative z-10"
      >
        {/* Gradient overlay for de-emphasized background when input is focused */}
        <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/90 via-background/50 to-transparent pointer-events-none z-10" />
        
        <div className="max-w-2xl mx-auto px-5 py-8 space-y-4" style={{ paddingBottom: 'calc(max(1rem, env(safe-area-inset-bottom)) + 5rem)' }}>
          {visibleCount < sortedMessages.length && (
            <div className="text-center pb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedMessages.length))}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full transition-all font-medium"
              >
                Tải thêm
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} mb-5`}
                >
                  <div className="max-w-[78%] space-y-1.5">
                    {i % 2 === 0 && (
                      <Skeleton className="h-3 w-16 ml-5 mb-1" />
                    )}
                    <Skeleton className="h-20 w-48 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : !fund ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6 shadow-lg">
                <NotePencil size={40} className="text-primary" weight="duotone" />
              </div>
              <p className="text-base font-bold text-foreground mb-2">Chưa có quỹ nào</p>
              <p className="text-sm text-muted-foreground mb-4">Tạo quỹ đầu tiên để bắt đầu quản lý chi tiêu</p>
              <Button
                variant="default"
                onClick={onOpenDrawer}
                className="mt-2"
              >
                Tạo quỹ mới
              </Button>
            </div>
          ) : visibleMessages.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6 shadow-lg">
                <NotePencil size={40} className="text-primary" weight="duotone" />
              </div>
              <p className="text-base font-bold text-foreground mb-2">Chưa có giao dịch nào</p>
              <p className="text-sm text-muted-foreground">Nhập giao dịch đầu tiên bên dưới</p>
            </div>
          ) : (
            // Reverse the list for chat view (newest at the bottom)
            [...visibleMessages].reverse().map((message) => {
              const isPending = message.isPendingPrompt === true
              const isCurrentUser = message.userId === currentUserId
              const clientStatus = message.clientStatus ?? 'sent'

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-5 group animate-in fade-in slide-in-from-bottom-3`}
                >
                  <div className={`max-w-[78%] space-y-1.5`}>
                    {!isCurrentUser && (
                      <p className="text-[11px] text-muted-foreground px-5 lowercase font-semibold tracking-wide">{message.userName}</p>
                    )}
                    <div className="relative">
                      <div
                        className={`rounded-2xl px-5 py-3.5 shadow-lg ${
                          isCurrentUser
                            ? isPending
                              ? 'bg-card/95 border border-border/60'
                              : 'bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-xl'
                            : 'bg-card/95 border border-border/60'
                        } transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]`}
                      >
                        <div className="space-y-2.5">
                          <p className={`text-sm leading-relaxed font-medium ${
                            isPending ? 'text-muted-foreground italic' : isCurrentUser ? 'text-primary-foreground' : 'text-foreground'
                          }`}>
                            {message.message}
                          </p>
                          {!isPending && (
                            <React.Fragment>
                              {(message.spend !== null || message.earn !== null) && (
                                <div className="flex items-center gap-3 pt-1.5">
                                  {message.spend !== null && (
                                    <span className="font-bold text-base text-red-500">
                                      -{formatCurrency(message.spend)}
                                    </span>
                                  )}
                                  {message.earn !== null && (
                                    <span className="font-bold text-base text-green-500">
                                      +{formatCurrency(message.earn)}
                                    </span>
                                  )}
                                </div>
                              )}
                              {message.categoryId && (
                                <div className="flex items-center gap-2 pt-1.5">
                                  <Tag 
                                    size={12} 
                                    weight="fill" 
                                    className={isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}
                                  />
                                  <span className={`text-[11px] uppercase tracking-wider font-semibold ${
                                    isCurrentUser ? 'text-primary-foreground/90' : 'text-muted-foreground'
                                  }`}>
                                    {categories.find((c) => c.id === message.categoryId)?.name || 'Không rõ'}
                                  </span>
                                </div>
                              )}
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                      
                      {/* FIXED: Deleting/Editing button logic (Visible on hover) */}
                      {/* Delete button only appears for non-pending messages */}
                      {!isPending && (
                        <div 
                          className={`absolute bottom-0 transition-opacity ${isCurrentUser ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100`}
                        >
                            <Button
                                size="icon"
                                onClick={() => {
                                  onDeleteMessage(message.id).catch(() => {})
                                }}
                                className="h-7 w-7 bg-background border border-border rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 shadow-lg transition-all"
                            >
                                <Trash size={12} weight="bold" />
                            </Button>
                        </div>
                      )}
                    </div>

                    {/* Footer: Timestamp, Reprocess/Edit/Pending status */}
                    <div className="flex items-center gap-2 px-4">
                      <p className="text-[10px] text-muted-foreground">
                        {/* FIXED: Correctly display timestamp */}
                        {formatDate(message.promptCreatedAt || message.timestamp)}
                      </p>

                      {isCurrentUser && clientStatus === 'sending' && (
                        <CircleNotch size={12} className="text-muted-foreground animate-spin" weight="bold" />
                      )}

                      {isCurrentUser && clientStatus === 'sent' && (
                        <CheckCircle size={12} className="text-emerald-500" weight="bold" />
                      )}

                      {isCurrentUser && clientStatus === 'failed' && (
                        <>
                          <XCircle size={12} className="text-destructive" weight="bold" />
                          {/* Resend button for failed messages */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-2 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-all ml-1 font-medium"
                            onClick={() => onResendMessage(message).catch(() => {})}
                            title="Gửi lại"
                          >
                            <ArrowRight size={10} weight="bold" className="mr-0.5" />
                            Gửi lại
                          </Button>
                        </>
                      )}
                      
                      {isPending && isCurrentUser && (
                        // Reprocess/Edit pending prompt button
                        <Button
                          variant="ghost"
                          className="h-5 w-5 text-accent hover:text-accent hover:bg-accent/10 rounded-full p-0 transition-all"
                          onClick={() => setEditingPendingPrompt(message)}
                          title="Chỉnh sửa và xử lý lại"
                        >
                          <ArrowClockwise size={11} weight="bold" />
                        </Button>
                      )}
                      
                      {/* Edit prompt button for messages without transaction (no spend/earn) */}
                      {!isPending && isCurrentUser && message.spend === null && message.earn === null && (
                        <Button
                          variant="ghost"
                          className="h-5 px-2 text-[10px] text-accent hover:text-accent hover:bg-accent/10 rounded-full transition-all ml-1 font-medium"
                          onClick={() => setEditingPendingPrompt(message)}
                          title="Chỉnh sửa prompt và xử lý lại"
                        >
                          <ArrowClockwise size={10} weight="bold" className="mr-0.5" />
                          Xử lý lại
                        </Button>
                      )}
                      
                      {/* Edit button for confirmed messages with transaction (if not pending) */}
                      {!isPending && isCurrentUser && (message.spend !== null || message.earn !== null) && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-0 transition-all"
                            onClick={() => setEditingMessage(message)}
                          >
                            <PencilSimple size={11} weight="bold" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Premium iOS-style Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-end justify-center" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <div className="w-full max-w-2xl px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="relative">
            {/* Floating Card Container */}
            <div className="relative bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.1)] border border-border/15">
              <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
                {/* Input Field */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={fund ? "Nhập giao dịch (VD: bánh tráng trộn 35)" : "Chọn quỹ để bắt đầu"}
                  disabled={!fund}
                  className="flex-1 h-14 sm:h-16 px-0 text-base sm:text-[17px] bg-transparent border-0 outline-none placeholder:text-muted-foreground/60 placeholder:font-normal text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
                
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || !fund}
                  className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/90 hover:bg-primary active:bg-primary/80 disabled:bg-muted/60 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 shadow-sm hover:shadow-md active:shadow-sm disabled:shadow-none disabled:cursor-not-allowed group touch-manipulation"
                  aria-label="Gửi tin nhắn"
                >
                  <PaperPlaneRight 
                    size={20} 
                    weight="fill" 
                    className="text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-0 group-active:translate-y-0" 
                  />
                </button>
              </div>
              
              {/* Subtle Focus Ring - appears when input has content */}
              <div className={`absolute inset-0 rounded-[28px] sm:rounded-[32px] pointer-events-none transition-opacity duration-300 ${
                input.trim() ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 rounded-[28px] sm:rounded-[32px] ring-1 ring-primary/15" />
              </div>
            </div>
          </form>
        </div>
      </div>

      <EditMessageDialog
        message={editingMessage}
        open={editingMessage !== null}
        onOpenChange={(open) => !open && setEditingMessage(null)}
        onSave={onUpdateMessage}
        onDelete={onDeleteMessage}
      />

      <EditPendingPromptDialog
        message={editingPendingPrompt}
        categories={categories}
        open={editingPendingPrompt !== null}
        onOpenChange={(open) => !open && setEditingPendingPrompt(null)}
        onSave={onUpdateMessage}
      />
    </div>
  )
}