export type AvailableCategoryDto = {
  id: string
  name: string
  description?: string | null
  isDefault: boolean
  parentId: string | null
  isSubscribed?: boolean | null
  image: string | null
  children?: AvailableCategoryDto[] | null
}

export type SubscribedCategoryDto = {
  id: string
  name: string
  description?: string | null
  parentId: string | null
  parent?: {
    id: string
    name: string
    description?: string | null
    parentId: string | null
    isDefault: boolean
  } | null
  isDefault: boolean
  fundId: string | null
  createdAt: string
  updatedAt: string
}

export type SubscribeResultDto = {
  success: boolean
  subscribedCount?: number
}

export type FundCategoryRelationDto = {
  id: string
  fundId: string
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
