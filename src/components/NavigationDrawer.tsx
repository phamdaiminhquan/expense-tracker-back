import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { 
  Plus, 
  Wallet, 
  Users, 
  Search,
  LogOut,
  X,
  Trash,
  Pencil
} from 'lucide-react'
import { Fund } from '@/apis/funds/fund.entities'
import { Mode } from '@/common/enums/mode.enum'
import { ACTION_SYSTEM } from '@/redux'
import { useAppDispatch } from '@/redux/store.redux'
import { useSelector } from 'react-redux'
import { GlobalReduxState } from '@/redux/store.interface'

interface NavigationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funds: Fund[]
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
  onSearchFunds?: (query: string) => void
}

export function NavigationDrawer({
  open,
  onOpenChange,
  funds,
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
  onSearchFunds,
  isPermanent = false,
}: NavigationDrawerProps & { isPermanent?: boolean }) {
  const dispatch = useAppDispatch();
  const system = useSelector((state: GlobalReduxState) => state.system);
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
    if (!isPermanent) onOpenChange(false)
  }, [onSelectFund, onOpenChange, isPermanent])

  const handleCreateFund = useCallback(() => {
    onCreateFund()
    if (!isPermanent) onOpenChange(false)
  }, [onCreateFund, onOpenChange, isPermanent])

  const handleUpdateFund = (e: React.MouseEvent, fundId: string) => {
    e.stopPropagation()
    onUpdateFund(fundId)
    if (!isPermanent) onOpenChange(false)
  }

  const handleDeleteFund = (e: React.MouseEvent, fundId: string) => {
    e.stopPropagation()
    onDeleteFund(fundId)
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const SidebarContent = (
    <div className="w-full h-full p-0 flex flex-col overflow-hidden bg-white">
        {/* Sidebar Header (Menu Title & Search) */}
        <div className="p-6 pb-4 border-b border-gray-100">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800">Menu</h2>
             {!isPermanent && (
               <button onClick={() => onOpenChange(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                 <X size={20} className="text-gray-500" />
               </button>
             )}
           </div>
           
           <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               onChange={(e) => onSearchFunds?.(e.target.value)}
               placeholder="Tìm kiếm quỹ..." 
               className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all border-none" 
             />
           </div>
        </div>

        {/* Sidebar Body (Funds List) */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2"
        >
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Danh sách quỹ</h3>
            <button 
              onClick={handleCreateFund}
              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          {isLoadingFunds ? (
            <div className="space-y-3 p-2">
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
          ) : (
            funds.map((fund) => {
              const isActive = fund.id === currentFundId
              return (
                <div
                  key={fund.id}
                  onClick={() => handleSelectFund(fund.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelectFund(fund.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`w-full group flex items-center gap-3 p-3 rounded-2xl transition-all text-left border cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-100'
                      : 'hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {fund.type === 'shared' ? <Users size={20} /> : <Wallet size={20} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm truncate ${isActive ? 'text-indigo-900' : 'text-gray-700'}`}>
                      {fund.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {fund.type === 'shared' ? 'Quỹ chung' : 'Quỹ cá nhân'}
                    </p>
                  </div>

                  <div className={`flex gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn event bubble lên button cha
                        handleUpdateFund(e, fund.id);
                      }}
                      className="h-7 w-7 p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn event bubble lên button cha
                        handleDeleteFund(e, fund.id);
                      }}
                      className="h-7 w-7 p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
          
          {isLoadingMore && (
            <div className="flex justify-center p-2">
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          )}
        </div>

        {/* Sidebar Footer (User Account & Logout) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
              <AvatarFallback className="bg-indigo-500 text-white font-bold">
                {getInitials(currentUserName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 truncate">{currentUserName}</p>
              <button 
                onClick={onLogout}
                className="flex items-center gap-1.5 text-rose-500 font-bold text-[10px] uppercase tracking-wider hover:opacity-80 transition-opacity"
              >
                <LogOut size={12} /> Đăng xuất
              </button>
            </div>
            
            <button 
              onClick={() => dispatch(ACTION_SYSTEM.changeMode(system.mode))}
              className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors"
            >
              <X size={18} className={system.mode === Mode.DARK ? 'text-indigo-500' : 'text-amber-500'} />
            </button>
          </div>
        </div>
    </div>
  );

  if (isPermanent) {
    return SidebarContent;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[85%] sm:w-[400px] p-0 flex flex-col overflow-hidden border-none shadow-2xl bg-white"
      >
        {SidebarContent}
      </SheetContent>
    </Sheet>
  )
}

