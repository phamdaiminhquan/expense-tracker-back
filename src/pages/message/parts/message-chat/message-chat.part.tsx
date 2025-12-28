import { useState, useRef, useEffect, useMemo } from 'react'
import { Message, Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import CapyInputBar from '@/components/CapyInputBar'
import {
  CreditCard, Wallet, Banknote, Sparkles, MessageSquare,
  TrendingDown, TrendingUp, Coffee, Zap, ShoppingBag,
  DollarSign, Briefcase, Gift, Car, Home, Smartphone,
  MoreHorizontal, Menu, Search, LogOut, X, AlertCircle, RefreshCw
} from 'lucide-react';

import { formatCurrency } from '@/lib/currency'
import { EditPendingPromptDialog } from '../../../../components/EditPendingPromptDialog'
import { EditMessageDialog } from '../../../../components/EditMessageDialog'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { Fund } from '@/apis/funds/fund.entities'

// ==========================================
// 1. ASSETS & THEME CONSTANTS
// ==========================================

export const THEME_COLORS = {
  bg: "bg-[#FAFAFA]", // Màu nền tổng thể
  text: "text-gray-800",
  smartModeGradient: "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
  expense: {
    text: "text-rose-500",
    bg: "bg-rose-500",
    shadow: "shadow-rose-200",
    ring: "focus-within:ring-rose-100"
  },
  income: {
    text: "text-emerald-600",
    bg: "bg-emerald-500",
    shadow: "shadow-emerald-200",
    ring: "focus-within:ring-emerald-100"
  }
};

const WALLETS_UI = [
  { id: 'cash', name: 'Tiền mặt', icon: <Banknote size={18} />, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'momo', name: 'Momo', icon: <Wallet size={18} />, color: 'bg-pink-100 text-pink-700' },
  { id: 'visa', name: 'Visa Techcom', icon: <CreditCard size={18} />, color: 'bg-blue-100 text-blue-700' },
  { id: 'vcb', name: 'Vietcombank', icon: <CreditCard size={18} />, color: 'bg-green-100 text-green-700' },
  { id: 'mb', name: 'MB Bank', icon: <CreditCard size={18} />, color: 'bg-blue-200 text-blue-800' },
  { id: 'zalo', name: 'ZaloPay', icon: <Wallet size={18} />, color: 'bg-cyan-100 text-cyan-700' },
];

const CATEGORIES_UI = {
  expense: [
    { id: 'food', label: 'Ăn uống', icon: <Coffee size={16} /> },
    { id: 'shopping', label: 'Mua sắm', icon: <ShoppingBag size={16} /> },
    { id: 'transport', label: 'Di chuyển', icon: <Car size={16} /> },
    { id: 'bill', label: 'Hóa đơn', icon: <Zap size={16} /> },
    { id: 'house', label: 'Nhà cửa', icon: <Home size={16} /> },
    { id: 'phone', label: 'Điện thoại', icon: <Smartphone size={16} /> },
  ],
  income: [
    { id: 'salary', label: 'Lương', icon: <DollarSign size={16} /> },
    { id: 'bonus', label: 'Thưởng', icon: <Gift size={16} /> },
    { id: 'invest', label: 'Đầu tư', icon: <TrendingUp size={16} /> },
    { id: 'freelance', label: 'Freelance', icon: <Briefcase size={16} /> },
  ]
};

// ==========================================
// 2. UI COMPONENTS
// ==========================================

export const DashboardHeaderUI = ({ totalExpense, totalIncome, onOpenSidebar, isSmartMode, onToggleSmart, fundName, onShowStatistics }: any) => {
  return (
    <div className="lg:pt-6 lg:pb-4 lg:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 px-4 bg-white/90 backdrop-blur-md border-b border-gray-100 z-20 shrink-0">
      <div className="flex justify-between items-center mb-3 lg:mb-4">
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Nút Hamburger chỉ hiện trên Mobile/Tablet (< lg) */}
          <button onClick={onOpenSidebar} className="lg:hidden p-1.5 -ml-1 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-[9px] lg:text-[10px] font-bold text-gray-400 lg:tracking-[0.2em] tracking-widest uppercase mb-0.5">{fundName || 'Tổng quan'}</h2>
            <div className="text-xs lg:text-sm font-bold text-gray-800">Giao dịch hôm nay</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Smart Mode Toggle */}
           <button 
             onClick={onToggleSmart}
             className={`flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all border 
               ${isSmartMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
           >
             {isSmartMode && <Sparkles size={10} />} {isSmartMode ? "AI PRO" : "BASIC"}
           </button>

           {/* Nút Statistic chỉ hiện khi màn hình chưa đủ lớn để hiện Cột 3 (< xl) */}
           <button 
             onClick={onShowStatistics}
             className="xl:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
           >
             <TrendingUp size={18} />
           </button>
        </div>
      </div>
      
      <div className="flex gap-6 lg:gap-10 px-1">
        <div className="transition-all duration-300">
          <div className="text-[8px] lg:text-[9px] uppercase tracking-wider text-rose-500 font-bold mb-0.5 opacity-80">Chi tiêu</div>
          <div className="text-lg lg:text-xl font-black text-gray-800 tracking-tight">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="transition-all duration-300">
          <div className="text-[8px] lg:text-[9px] uppercase tracking-wider text-emerald-600 font-bold mb-0.5 opacity-80">Thu nhập</div>
          <div className="text-lg lg:text-xl font-black text-gray-800 tracking-tight">{formatCurrency(totalIncome)}</div>
        </div>
      </div>
    </div>
  );
};

export const MessageBubbleUI = ({ msg, onRetry, isCurrentUser, walletName }: any) => {
  const walletInfo = WALLETS_UI.find(w => w.id === 'momo') || WALLETS_UI[0];

  if (!isCurrentUser) {
    return (
      <div className={`max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm ${msg.status === 'error' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-gray-100 text-gray-600'}`}>
        {msg.status === 'error' && <AlertCircle size={16} className="inline mr-1 -mt-0.5"/>}
        {msg.text}
      </div>
    );
  }

  const isError = msg.status === 'error';
  const isAnalyzing = msg.status === 'analyzing';
  const isDone = msg.status === 'done';

  return (
    <div 
      onClick={() => isError && onRetry ? onRetry(msg) : null}
      className={`
        relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-500
        rounded-tr-sm border 
        ${isError 
          ? 'bg-red-50 border-red-200 text-gray-800 cursor-pointer hover:bg-red-100 ring-2 ring-red-100' 
          : 'bg-white border-gray-100 text-gray-700'
        }
        ${isAnalyzing ? 'ring-2 ring-indigo-100' : ''}
    `}>
      <div className="flex items-center gap-1.5 mb-2 opacity-80 text-[10px] font-bold uppercase tracking-wide border-b border-gray-50 pb-1">
        <span className="text-gray-400 flex items-center gap-1">
          {walletInfo?.icon} {walletName || walletInfo?.name}
        </span>
        <div className="ml-auto">
          {isAnalyzing && <span className="text-indigo-500 flex items-center gap-1 animate-pulse"><Sparkles size={10} /> Analyzing...</span>}
          {isDone && <span className={`flex items-center gap-1 ${msg.transType === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>{msg.category}</span>}
          {isError && <span className="text-red-500 flex items-center gap-1 animate-pulse font-bold"><AlertCircle size={10} /> Lỗi</span>}
        </div>
      </div>
      
      <div className="flex justify-between items-baseline gap-4">
        <span>{msg.text}</span>
        {isDone && msg.rawAmount > 0 && (
          <span className={`font-bold whitespace-nowrap ${msg.transType === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
            {msg.transType === 'expense' ? '-' : '+'}{formatCurrency(msg.rawAmount)}
          </span>
        )}
      </div>

      {isError && (
        <div className="mt-2 pt-2 border-t border-red-100 text-[10px] font-bold text-red-500 flex items-center gap-1 justify-end">
          <RefreshCw size={10} /> Bấm để sửa
        </div>
      )}
    </div>
  );
};

interface ChatMessageViewProps {
  fund: Fund | null
  funds: Fund[]
  messages: Message[]
  categories: Category[]
  currentUserId: string
  currentUserName: string
  resolveUserName: (userId: string) => string
  onOpenDrawer: () => void
  onShowStatistics: () => void
  onManageCategories: () => void
  onShowCategorySubscription: () => void
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>

  onResendMessage: (message: Message) => Promise<void>
  onUpdateMessage: (message: Message) => Promise<void>
  onDeleteMessage: (id: string) => Promise<void>
  onSelectFund: (fundId: string) => void
  isProcessing?: boolean
  isLoading?: boolean
  isLoadingFunds?: boolean
}

const ITEMS_PER_PAGE = 10

export function ChatMessageView({
  fund,
  funds,
  messages,
  categories,
  currentUserId,
  currentUserName,
  resolveUserName,
  onOpenDrawer,
  onShowStatistics,
  onManageCategories,
  onShowCategorySubscription,
  onAddMessage,

  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  onSelectFund,
  isProcessing = false,
  isLoading = false,
  isLoadingFunds = false,
}: ChatMessageViewProps) {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editingPendingPrompt, setEditingPendingPrompt] = useState<Message | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [isSmartMode, setIsSmartMode] = useState(true)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [showCategorySelector, setShowCategorySelector] = useState(false)
  const [selectedWalletId, setSelectedWalletId] = useState('momo')

  const selectedWallet = WALLETS_UI.find(w => w.id === selectedWalletId) || WALLETS_UI[0]

  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp)
  const visibleMessages = sortedMessages.slice(0, visibleCount)

  // Calculate stats
  const { totalExpense, totalIncome } = useMemo(() => {
    let expense = 0
    let income = 0
    // Lọc tin nhắn của ngày hôm nay
    const today = new Date().toDateString()
    messages.forEach(m => {
      const msgDate = new Date(m.createdAt || m.timestamp).toDateString()
      if (msgDate === today && m.transaction) {
        expense += m.transaction.spendValue || 0
        income += m.transaction.earnValue || 0
      }
    })
    return { totalExpense: expense, totalIncome: income }
  }, [messages])

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    if (container.scrollTop === 0 && visibleCount < sortedMessages.length) {
      const oldScrollHeight = container.scrollHeight
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedMessages.length))

      setTimeout(() => {
        const newScrollHeight = container.scrollHeight
        container.scrollTop = newScrollHeight - oldScrollHeight
      }, 0)
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  return (
    <div className={`flex flex-col h-[100dvh] lg:h-full bg-white font-sans overflow-hidden relative`}>
      
      {/* 2. HEADER - Fixed at top */}
      <DashboardHeaderUI 
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        isSmartMode={isSmartMode}
        onOpenSidebar={onOpenDrawer}
        onToggleSmart={() => setIsSmartMode(!isSmartMode)}
        fundName={fund?.name}
        onShowStatistics={onShowStatistics}
      />

      {/* 3. MESSAGE LIST - Scrollable with safe areas */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-6 scroll-smooth relative z-0 bg-[#FAFAFA] min-h-0"
      >
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <Skeleton className="h-16 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : !fund ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[32px] bg-gray-50 mb-6 shadow-inner">
              <Search size={40} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">Chưa chọn quỹ</p>
            <p className="text-sm text-gray-400 mb-6">Vui lòng chọn một quỹ từ menu bên trái để bắt đầu.</p>
            <Button onClick={onOpenDrawer} variant="outline" className="rounded-xl">Mở danh sách quỹ</Button>
          </div>
        ) : (
          [...visibleMessages].reverse().map((message) => {
            const isCurrentUser = message.createdById === currentUserId
            
            // Map message to UI format
            const uiMsg = {
              id: message.id,
              text: message.message,
              rawAmount: message.transaction?.spendValue || message.transaction?.earnValue || 0,
              status: message.clientStatus === 'failed' ? 'error' : (message.isPendingPrompt ? 'analyzing' : 'done'),
              transType: (message.transaction?.spendValue || 0) > 0 ? 'expense' : 'income',
              category: message.categoryName || 'Chưa phân loại',
              wallet: fund?.name
            }

            return (
              <div 
                key={message.id} 
                className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
              >
                <MessageBubbleUI 
                  msg={uiMsg} 
                  isCurrentUser={isCurrentUser}
                  walletName={fund?.name}
                  onRetry={() => {
                    if (uiMsg.status === 'error') {
                      onResendMessage(message)
                    } else {
                      setEditingPendingPrompt(message)
                    }
                  }}
                />
              </div>
            )
          })
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* 4. FOOTER & INPUT AREA - Fixed at bottom */}
      <div className="shrink-0 z-20 bg-white">
        {/* INTEGRATION ZONE: CapyInputBar */}
        <CapyInputBar
          inputValue={input}
          setInputValue={setInput}
          selectedWallet={selectedWallet}
          isSmartMode={isSmartMode}
          isAnalyzing={isProcessing}
          capyMood={isProcessing ? 'excited' : 'sleepy'}
          onSend={() => {
            if (!input.trim() || !fund) return;
            onAddMessage({
              createdById: currentUserId,
              userName: currentUserName,
              fundId: fund.id,
              spend: null,
              earn: null,
              message: input.trim(),
              isPendingPrompt: true,
              originalPrompt: input.trim(),
              createdAt: Date.now(),
            });
            setInput('');
          }}
          onFocus={() => {}}
          onBlur={() => {}}
          onWalletClick={() => setShowWalletSelector(true)}
          onCategoryClick={() => setShowCategorySelector(true)}
        />
      </div>

      {/* 5. MODALS */}
      {showWalletSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowWalletSelector(false)} />
            <div className="bg-white w-full max-w-md rounded-t-[32px] p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom">
                <h3 className="font-bold mb-4">Chọn ví nguồn</h3>
                <div className="grid grid-cols-2 gap-3 pb-4">
                    {WALLETS_UI.map(w => (
                        <button 
                          key={w.id} 
                          onClick={() => {
                            setSelectedWalletId(w.id)
                            setShowWalletSelector(false)
                          }} 
                          className={`flex gap-3 p-3 rounded-xl border text-left items-center transition-all ${selectedWalletId === w.id ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-gray-50 border-gray-100'}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${w.color}`}>
                              {w.icon}
                            </div>
                            <span className={`font-semibold text-sm truncate ${selectedWalletId === w.id ? 'text-indigo-900' : 'text-gray-700'}`}>{w.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {showCategorySelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowCategorySelector(false)} />
          <div className="bg-white w-full max-w-md rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative z-10 max-h-[70vh] flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Danh mục</h3>
            <div className="grid grid-cols-4 gap-4 overflow-y-auto pb-8">
              {CATEGORIES_UI.expense.map((cat) => (
                <button key={cat.id} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center text-xl">{cat.icon}</div>
                  <div className="text-xs text-center font-medium text-gray-600 line-clamp-1">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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