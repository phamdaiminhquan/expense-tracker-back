import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Fund, FundType } from '@/lib/types'
import { createFund as apiCreateFund, getListFunds } from '@/apis/funds/fund.api'
import { canAccessFund } from '@/lib/funds'
import { useAuth } from './AuthProvider'

interface FundContextValue {
  funds: Fund[]
  visibleFunds: Fund[]
  selectedFund: Fund | null
  fundId: string | null
  enterFund: (fund: Fund) => void
  backToFundList: () => void
  createFund: (name: string, type: FundType, memberIds: string[]) => Promise<Fund>
  fetchFunds: () => Promise<void>
  isLoading: boolean
  isCreating: boolean
  setFunds: React.Dispatch<React.SetStateAction<Fund[]>>
}

const FundContext = createContext<FundContextValue | null>(null)

function useFundState(currentUserId: string | null): FundContextValue {
  const [funds, setFunds] = useState<Fund[]>([])
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const fetchFunds = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getListFunds()
      setFunds(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
        setFunds((current) => [...current, newFund])
        return newFund
      } finally {
        setIsCreating(false)
      }
    },
    [currentUserId]
  )

  const visibleFunds = useMemo(() => {
    if (!currentUserId) return []
    return funds.filter((fund) => canAccessFund(fund, currentUserId))
  }, [currentUserId, funds])

  const fundId = selectedFund?.id ?? null

  return {
    funds,
    visibleFunds,
    selectedFund,
    fundId,
    enterFund,
    backToFundList,
    createFund,
    fetchFunds,
    isLoading,
    isCreating,
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
