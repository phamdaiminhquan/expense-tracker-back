import { useContext } from 'react'
import { CategoryProvider, useCategories as useCategoriesFromProvider } from '@/app/providers/CategoryProvider'

export function useCategories() {
  return useCategoriesFromProvider()
}

export { CategoryProvider }
