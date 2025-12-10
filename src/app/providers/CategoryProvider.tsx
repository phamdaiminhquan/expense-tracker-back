import { createContext, useContext, useMemo, useState } from 'react'
import { Category } from '@/lib/types'
import { createCategory as createCategoryFactory } from '@/lib/categories'

interface CategoryContextValue {
  categories: Category[]
  createCategory: (fundId: string | null, name: string, description: string) => Category | null
  updateCategory: (categoryId: string, name: string, description: string) => void
  deleteCategory: (categoryId: string) => void
  getCategoriesByFund: (fundId: string | null) => Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

function useCategoryState(): CategoryContextValue {
  const [categories, setCategories] = useState<Category[]>([])

  const createCategory = (fundId: string | null, name: string, description: string) => {
    if (!fundId) return null

    const newCategory = createCategoryFactory(fundId, name, description)
    setCategories((current) => [...current, newCategory])
    return newCategory
  }

  const updateCategory = (categoryId: string, name: string, description: string) => {
    setCategories((current) =>
      current.map((category) => (category.id === categoryId ? { ...category, name, description } : category))
    )
  }

  const deleteCategory = (categoryId: string) => {
    setCategories((current) => current.filter((category) => category.id !== categoryId))
  }

  const getCategoriesByFund = useMemo(
    () => (fundId: string | null) => categories.filter((category) => category.fundId === fundId),
    [categories]
  )

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByFund,
    setCategories,
  }
}

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const value = useCategoryState()
  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}

export function useCategories(): CategoryContextValue {
  const ctx = useContext(CategoryContext)
  if (!ctx) {
    throw new Error('useCategories must be used within CategoryProvider')
  }
  return ctx
}

export { CategoryContext }
