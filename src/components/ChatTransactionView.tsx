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
} from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/currency'
import { EditTransactionDialog } from './EditTransactionDialog'
import { EditPendingPromptDialog } from './EditPendingPromptDialog'
import { MOCK_USERS } from '@/lib/auth'

interface ChatTransactionViewProps {
  fund: Fund
  transactions: Transaction[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  onBack: () => void
  onShowStatistics: () => void
  onManageCategories: () => void
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void
  onUpdateTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (id: string) => void
  isProcessing?: boolean
}

const ITEMS_PER_PAGE = 10

export function ChatTransactionView({
  fund,
  transactions,
  categories,
  currentUserId,
  currentUserName,
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

    if (container.scrollTop === 0 && visibleCount < sortedTransactions.length) {
      const oldScrollHeight = container.scrollHeight
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedTransactions.length))
      
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight
        container.scrollTop = newScrollHeight - oldScrollHeight
      }, 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    onAddTransaction({
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
  }

  useEffect(() => {
    if (bottomRef.current && !isProcessing) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [transactions.length, isProcessing])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }
  }

  const getMemberNames = () => {
    return fund.memberIds
      .map((id) => MOCK_USERS.find((u) => u.id === id)?.name || 'Unknown')
      .join(', ')
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft size={20} />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-xl truncate">{fund.name}</h1>
                <p className="text-sm text-muted-foreground truncate">
                  {fund.type === 'shared' ? getMemberNames() : 'Quỹ cá nhân'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onManageCategories}>
                <Tag size={20} />
              </Button>
              <Button variant="outline" size="icon" onClick={onShowStatistics}>
                <ChartBar size={20} />
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
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-4">
          {visibleCount < sortedTransactions.length && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedTransactions.length))}
              >
                Tải thêm giao dịch cũ hơn
              </Button>
            </div>
          )}

          {visibleTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Chưa có giao dịch nào</p>
              <p className="text-sm mt-2">Nhập giao dịch đầu tiên bên dưới</p>
            </div>
          ) : (
            [...visibleTransactions].reverse().map((transaction) => {
              const isPending = transaction.isPendingPrompt === true
              const isCurrentUser = transaction.userId === currentUserId

              return (
                <div
                  key={transaction.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] space-y-1`}>
                    {!isCurrentUser && (
                      <p className="text-xs text-muted-foreground px-3">{transaction.userName}</p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isCurrentUser
                          ? isPending
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-primary text-primary-foreground'
                          : 'bg-card border'
                      }`}
                    >
                      <div className="space-y-2">
                        {isPending && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300"
                          >
                            <NotePencil className="mr-1" size={12} />
                            Ghi chú tạm
                          </Badge>
                        )}
                        <p className={isPending ? 'text-muted-foreground italic' : ''}>
                          {transaction.content}
                        </p>
                        {!isPending && (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              {transaction.spend !== null && (
                                <Badge
                                  variant="destructive"
                                  className="font-mono text-sm"
                                >
                                  -{formatCurrency(transaction.spend)}
                                </Badge>
                              )}
                              {transaction.earn !== null && (
                                <Badge
                                  className="font-mono text-sm bg-accent text-accent-foreground hover:bg-accent/90"
                                >
                                  +{formatCurrency(transaction.earn)}
                                </Badge>
                              )}
                            </div>
                            {transaction.categoryId && (
                              <div className="pt-1">
                                <Badge
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  <Tag size={12} className="mr-1" />
                                  {categories.find((c) => c.id === transaction.categoryId)?.name || 'Không rõ'}
                                </Badge>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.promptCreatedAt || transaction.timestamp)}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isPending ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-primary"
                            onClick={() => setEditingPendingPrompt(transaction)}
                          >
                            <ArrowClockwise size={14} />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <PencilSimple size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => onDeleteTransaction(transaction.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
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
              placeholder="Nhập chi tiêu của bạn..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isProcessing}>
              {isProcessing ? (
                <CircleNotch size={20} className="animate-spin" />
              ) : (
                <PaperPlaneRight size={20} weight="fill" />
              )}
            </Button>
          </form>
        </div>
      </div>

      <EditTransactionDialog
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSave={onUpdateTransaction}
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
