import { useContext } from 'react'
import { FundProvider, useFunds as useFundsFromProvider } from '@/app/providers/FundProvider'

// NOTE: This hook now reads from FundProvider context.
export function useFunds() {
  return useFundsFromProvider()
}

export { FundProvider }
