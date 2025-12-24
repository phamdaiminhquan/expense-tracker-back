import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Fund, FundType } from '@/lib/types'
import { createFund as apiCreateFund, getListFunds, updateFund as apiUpdateFund, deleteFund as apiDeleteFund } from '@/apis/funds/fund.api'
import { canAccessFund } from '@/lib/funds'
import { useAuth } from './AuthProvider'
import { FundsListQuery } from '@/apis/funds/fund.interface'

interface FundContextValue {
  funds: Fund[]
  visibleFunds: Fund[]
  selectedFund: Fund | null
  fundId: string | null
  total: number
  hasMore: boolean
  enterFund: (fund: Fund) => void
  backToFundList: () => void
  createFund: (name: string, type: FundType, memberIds: string[]) => Promise<Fund>
  updateFund: (id: string, name: string, type: FundType) => Promise<void>
  deleteFund: (id: string) => Promise<void>
  fetchFunds: (query: FundsListQuery) => Promise<void>
  loadMoreFunds: () => Promise<void>
  isLoading: boolean
  isCreating: boolean
  isLoadingMore: boolean
  setFunds: React.Dispatch<React.SetStateAction<Fund[]>>
}

const FundContext = createContext<FundContextValue | null>(null)

function useFundState(currentUserId: string | null): FundContextValue {
  const [funds, setFunds] = useState<Fund[]>([])
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchFunds = useCallback(async (page: number = 1, append: boolean = false) => {
    if (page === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }
    
    try {
      const { funds: fundsData, total: totalCount } = await getListFunds({
        page,
        take: 10, // Load 10 funds mỗi lần
        orderBy: 'lastActivityTime',
        orderType: 'DESC',
      })
      
      if (append) {
        setFunds((prev) => [...prev, ...fundsData])
      } else {
        setFunds(fundsData)
      }
      
      setTotal(totalCount)
      setCurrentPage(page)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [currentUserId])

  const loadMoreFunds = useCallback(async () => {
    if (isLoadingMore || funds.length >= total) return
    
    const nextPage = currentPage + 1
    await fetchFunds(nextPage, true)
  }, [isLoadingMore, funds.length, total, currentPage, fetchFunds])

  useEffect(() => {
    if (!currentUserId) {
      setFunds([])
      setSelectedFund(null)
      return
    }

    fetchFunds()
  }, [currentUserId, fetchFunds])

  useEffect(() => {
    if (!selectedFund) return
    const refreshed = funds.find((fund) => fund.id === selectedFund.id)
    if (refreshed) {
      setSelectedFund(refreshed)
    } else if (funds.length > 0) {
      setSelectedFund(null)
    }
  }, [funds, selectedFund])

  const enterFund = useCallback((fund: Fund) => {
    setSelectedFund(fund)
  }, [])

  const backToFundList = useCallback(() => {
    setSelectedFund(null)
  }, [])

  const createFund = useCallback(
    async (name: string, type: FundType, memberIds: string[]) => {
      if (!currentUserId) throw new Error('Chưa đăng nhập')

      setIsCreating(true)
      try {
        const newFund = await apiCreateFund({ name, type, memberIds })
        // Thêm vào đầu list vì fund mới sẽ có lastActivityTime mới nhất
        setFunds((current) => [newFund, ...current])
        setTotal((prev) => prev + 1)
        return newFund
      } finally {
        setIsCreating(false)
      }
    },
    [currentUserId]
  )

  const updateFund = useCallback(
    async (id: string, name: string, type: FundType) => {
      if (!currentUserId) throw new Error('Chưa đăng nhập')

      setIsCreating(true)
      try {
        await apiUpdateFund(id, { name, type })
        // Cập nhật fund trong danh sách
        setFunds((current) => current.map((fund) => (fund.id === id ? { ...fund, name, type } : fund)))
        return
      } finally {
        setIsCreating(false)
      }
    },
    [currentUserId]
  )

  const deleteFund = useCallback(
    async (id: string) => {
      if (!currentUserId) throw new Error('Chưa đăng nhập')

      setIsCreating(true)
      try {
        await apiDeleteFund(id) 
        setFunds((current) => current.filter((fund) => fund.id !== id))
        setTotal((prev) => prev - 1)

        if (selectedFund?.id === id) {
          setSelectedFund(null)
        }
      } finally {
        setIsCreating(false)
      }
    },
    [currentUserId, selectedFund]
  )

  const visibleFunds = useMemo(() => {
    if (!currentUserId) return []
    return funds.filter((fund) => canAccessFund(fund, currentUserId))
  }, [currentUserId, funds])

  const fundId = selectedFund?.id ?? null
  const hasMore = funds.length < total

  return {
    funds,
    visibleFunds,
    selectedFund,
    fundId,
    total,
    hasMore,
    enterFund,
    backToFundList,
    createFund,
    updateFund,
    deleteFund,
    fetchFunds: () => fetchFunds(1, false),
    loadMoreFunds,
    isLoading,
    isCreating,
    isLoadingMore,
    setFunds,
  }
}

export function FundProvider({ children }: { children: React.ReactNode }) {
  const { currentUserId } = useAuth()
  const value = useFundState(currentUserId)
  return <FundContext.Provider value={value}>{children}</FundContext.Provider>
}

export function useFunds(): FundContextValue {
  const ctx = useContext(FundContext)
  if (!ctx) {
    throw new Error('useFunds must be used within FundProvider')
  }
  return ctx
}

export { FundContext }
