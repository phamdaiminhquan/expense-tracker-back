import { useState, useRef, useEffect } from 'react'
import { Transaction, Fund, Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
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
} from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/currency'
import { EditTransactionDialog } from './EditTransactionDialog'
import { EditPendingPromptDialog } from './EditPendingPromptDialog'

interface ChatTransactionViewProps {
  fund: Fund
  transactions: Transaction[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  resolveUserName: (userId: string) => string
  onBack: () => void
  onShowStatistics: () => void
  onManageCategories: () => void
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>
  onUpdateTransaction: (transaction: Transaction) => Promise<void>
  onDeleteTransaction: (id: string) => Promise<void>
  isProcessing?: boolean
}

const ITEMS_PER_PAGE = 10

export function ChatTransactionView({
  fund,
  transactions,
  categories,
  currentUserId,
  currentUserName,
  resolveUserName,
  onBack,
  onShowStatistics,
  onManageCategories,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  isProcessing = false,
}: ChatTransactionViewProps) {
  const [input, setInput] = useState('')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editingPendingPrompt, setEditingPendingPrompt] = useState<Transaction | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp)
  const visibleTransactions = sortedTransactions.slice(0, visibleCount)

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    // Logic to load previous pages when scrolling to the top
    if (container.scrollTop === 0 && visibleCount < sortedTransactions.length) {
      const oldScrollHeight = container.scrollHeight
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedTransactions.length))
      
      // Maintain scroll position after loading more items
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight
        container.scrollTop = newScrollHeight - oldScrollHeight
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      await onAddTransaction({
        userId: currentUserId,
        userName: currentUserName,
        fundId: fund.id,
        spend: null,
        earn: null,
        content: input.trim(),
        isPendingPrompt: true,
        originalPrompt: input.trim(),
        promptCreatedAt: Date.now(),
      })
      setInput('')
    } catch (error) {
      // Error toast handled upstream
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [transactions.length])

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
    return fund.memberIds.map((id) => resolveUserName(id)).join(', ')
  }

  return (
    <div className="h-screen flex flex-col bg-[#f0f0f5]">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="h-9 w-9 hover:bg-gray-100"
              >
                <ArrowLeft size={20} weight="regular" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-base truncate text-gray-900">{fund.name}</h1>
                <p className="text-xs text-gray-500 truncate">
                  {fund.type === 'shared' ? getMemberNames() : 'AI Bot'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onManageCategories}
                className="h-9 w-9 hover:bg-gray-100 text-gray-600"
              >
                <Tag size={20} weight="regular" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onShowStatistics}
                className="h-9 w-9 hover:bg-gray-100 text-gray-600"
              >
                <ChartBar size={20} weight="regular" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-1">
          {visibleCount < sortedTransactions.length && (
            <div className="text-center pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedTransactions.length))}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                Tải thêm
              </Button>
            </div>
          )}

          {visibleTransactions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">Chưa có giao dịch nào</p>
              <p className="text-xs mt-1">Nhập giao dịch đầu tiên bên dưới</p>
            </div>
          ) : (
            // Reverse the list for chat view (newest at the bottom)
            [...visibleTransactions].reverse().map((transaction) => {
              const isPending = transaction.isPendingPrompt === true
              const isCurrentUser = transaction.userId === currentUserId
              const clientStatus = transaction.clientStatus ?? 'sent'

              return (
                <div
                  key={transaction.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 group`}
                >
                  <div className={`max-w-[75%] space-y-0.5`}>
                    {!isCurrentUser && (
                      <p className="text-[10px] text-gray-400 px-3 lowercase">{transaction.userName}</p>
                    )}
                    <div className="relative">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 ${
                          isCurrentUser
                            ? isPending
                              ? 'bg-white border border-gray-200'
                              : 'bg-[#4169E1] text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <p className={`text-sm leading-snug ${
                            isPending ? 'text-gray-500' : isCurrentUser ? 'text-white' : 'text-gray-900'
                          }`}>
                            {transaction.content}
                          </p>
                          {!isPending && (
                            <>
                              {(transaction.spend !== null || transaction.earn !== null) && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  {transaction.spend !== null && (
                                    <span
                                      className={`font-medium text-sm ${
                                        isCurrentUser ? 'text-white' : 'text-red-500'
                                      }`}
                                    >
                                      -{formatCurrency(transaction.spend)}
                                    </span>
                                  )}
                                  {transaction.earn !== null && (
                                    <span
                                      className={`font-medium text-sm ${
                                        isCurrentUser ? 'text-white' : 'text-green-500'
                                      }`}
                                    >
                                      +{formatCurrency(transaction.earn)}
                                    </span>
                                  )}
                                </div>
                              )}
                              {transaction.categoryId && (
                                <div className="flex items-center gap-1 pt-0.5">
                                  <Tag 
                                    size={10} 
                                    weight="fill" 
                                    className={isCurrentUser ? 'text-white/70' : 'text-gray-400'}
                                  />
                                  <span className={`text-[10px] uppercase tracking-wide ${
                                    isCurrentUser ? 'text-white/80' : 'text-gray-500'
                                  }`}>
                                    {categories.find((c) => c.id === transaction.categoryId)?.name || 'Không rõ'}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* FIXED: Deleting/Editing button logic (Visible on hover) */}
                      {/* Delete button only appears for non-pending messages */}
                      {!isPending && (
                        <div 
                          className={`absolute bottom-0 transition-opacity ${isCurrentUser ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100`}
                        >
                            <Button
                                size="icon"
                                onClick={() => {
                                  onDeleteTransaction(transaction.id).catch(() => {})
                                }}
                                className="h-6 w-6 bg-white border border-gray-200 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 shadow-md"
                            >
                                <Trash size={12} weight="bold" />
                            </Button>
                        </div>
                      )}
                    </div>

                    {/* Footer: Timestamp, Reprocess/Edit/Pending status */}
                    <div className="flex items-center gap-1.5 px-3">
                      <p className="text-[10px] text-gray-400">
                        {/* FIXED: Correctly display timestamp */}
                        {formatDate(transaction.promptCreatedAt || transaction.timestamp)}
                      </p>

                      {isCurrentUser && clientStatus === 'sending' && (
                        <CircleNotch size={12} className="text-gray-400 animate-spin" weight="bold" />
                      )}

                      {isCurrentUser && clientStatus === 'sent' && (
                        <CheckCircle size={12} className="text-emerald-500" weight="bold" />
                      )}

                      {isCurrentUser && clientStatus === 'failed' && (
                        <XCircle size={12} className="text-red-500" weight="bold" />
                      )}
                      
                      {isPending && isCurrentUser && (
                        // Reprocess/Edit pending prompt button
                        <Button
                          variant="ghost"
                          className="h-4 w-4 text-yellow-600 hover:text-yellow-700 hover:bg-transparent p-0"
                          onClick={() => setEditingPendingPrompt(transaction)}
                        >
                          <ArrowClockwise size={10} weight="bold" />
                        </Button>
                      )}
                      
                      {/* Edit button for confirmed transactions (if not pending) */}
                      {!isPending && isCurrentUser && (
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 text-gray-400 hover:text-gray-600 hover:bg-transparent p-0"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <PencilSimple size={10} weight="bold" />
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

      <div className="sticky bottom-0 bg-background border-t shadow-lg">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập chi tiêu..."
              disabled={false}
              className="flex-1 border-0 bg-[#f0f0f5] rounded-full px-4 py-2.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim()}
              className="h-10 w-10 rounded-full bg-[#f0f0f5] hover:bg-gray-200 text-gray-600 disabled:opacity-50 disabled:bg-[#f0f0f5]"
              variant="ghost"
            >
              <PaperPlaneRight size={20} weight="fill" className={input.trim() ? 'text-[#4169E1]' : 'text-gray-400'} />
            </Button>
          </form>
        </div>
      </div>

      <EditTransactionDialog
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSave={onUpdateTransaction}
        onDelete={onDeleteTransaction}
      />

      <EditPendingPromptDialog
        transaction={editingPendingPrompt}
        categories={categories}
        open={editingPendingPrompt !== null}
        onOpenChange={(open) => !open && setEditingPendingPrompt(null)}
        onSave={onUpdateTransaction}
      />
    </div>
  )
}