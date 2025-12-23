import { axiosRequest } from '@/common/config/axios.config'
import {
  AvailableCategoryDto,
  FundCategoryRelationDto,
  SubscribeResultDto,
  SubscribedCategoryDto,
} from './category.interface'

export async function listSubscribedCategories(fundId: string): Promise<SubscribedCategoryDto[]> {
  const res = await axiosRequest.get<SubscribedCategoryDto[]>(`/funds/${fundId}/categories`)
  return res.data || []
}

export async function listAvailableCategories(fundId: string): Promise<AvailableCategoryDto[]> {
  const res = await axiosRequest.get<AvailableCategoryDto[]>(`/funds/${fundId}/categories/available`)
  return res.data || []
}

export async function subscribeCategory(fundId: string, categoryId: string): Promise<FundCategoryRelationDto> {
  const res = await axiosRequest.post<FundCategoryRelationDto>(`/funds/${fundId}/categories/${categoryId}/subscribe`)
  return res.data
}

export async function unsubscribeCategory(fundId: string, categoryId: string): Promise<FundCategoryRelationDto> {
  const res = await axiosRequest.post<FundCategoryRelationDto>(`/funds/${fundId}/categories/${categoryId}/unsubscribe`)
  return res.data
}

export async function subscribeAllCategories(fundId: string): Promise<SubscribeResultDto> {
  const res = await axiosRequest.post<SubscribeResultDto>(`/funds/${fundId}/categories/subscribe-all`)
  return res.data
}

export async function subscribeAllChildrenOfParent(fundId: string, parentId: string): Promise<SubscribeResultDto> {
  const res = await axiosRequest.post<SubscribeResultDto>(`/funds/${fundId}/categories/parent/${parentId}/subscribe-all`)
  return res.data
}
