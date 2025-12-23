import { axiosRequest } from '@/common/config/axios.config'
import { Fund } from '@/lib/types'
import {
	AddMemberPayload,
	CreateFundPayload,
	FundDto,
	FundMemberDto,
	FundsListResponse,
	FundsListQuery,
	UpdateFundPayload,
} from './fund.interface'

function mapFund(dto: FundDto): Fund {
	return {
		id: dto.id,
		name: dto.name,
		type: dto.type,
		ownerId: dto.ownerId,
		memberIds: dto.memberIds && dto.memberIds.length > 0 ? dto.memberIds : [],
		createdAt: typeof dto.createdAt === 'string' ? Date.parse(dto.createdAt) : dto.createdAt,
		lastMessage: dto.lastMessage ? {
			id: dto.lastMessage.id,
			text: dto.lastMessage.message || '',
			timestamp: typeof dto.lastMessage.createdAt === 'string'
				? Date.parse(dto.lastMessage.createdAt)
				: dto.lastMessage.createdAt,
			processedAt: dto.lastMessage.processedAt
				? (typeof dto.lastMessage.processedAt === 'string'
					? Date.parse(dto.lastMessage.processedAt)
					: dto.lastMessage.processedAt)
				: null,
		} : undefined,
	}
}

export async function getListFunds(query: FundsListQuery = {}): Promise<{ funds: Fund[], total: number }> {
	const params = new URLSearchParams({
		page: String(query.page || 1),
		take: String(query.take || 10),
		orderBy: query.orderBy || 'lastActivityTime',
		orderType: query.orderType || 'DESC',
		...(query.search && { search: query.search }),
	})

	const res = await axiosRequest.get<FundsListResponse>(`/funds?${params}`)
	return {
		funds: (res.data?.data || []).map(mapFund),
		total: res.data?.total || 0,
	}
}

export async function createFund(payload: CreateFundPayload): Promise<Fund> {
	const res = await axiosRequest.post<FundDto>('/funds', payload)
	return mapFund(res.data)
}

export async function getFundDetail(fundId: string): Promise<Fund> {
	const res = await axiosRequest.get<FundDto>(`/funds/${fundId}`)
	return mapFund(res.data)
}

export async function updateFund(fundId: string, payload: UpdateFundPayload): Promise<Fund> {
	const res = await axiosRequest.patch<FundDto>(`/funds/${fundId}`, payload)
	return mapFund(res.data)
}

export async function deleteFund(fundId: string): Promise<boolean> {
	await axiosRequest.delete(`/funds/${fundId}`)
	return true
}

export async function getFundMembers(fundId: string): Promise<FundMemberDto[]> {
	const res = await axiosRequest.get<FundMemberDto[]>(`/funds/${fundId}/members`)
	return res.data || []
}

export async function addFundMember(fundId: string, payload: AddMemberPayload): Promise<FundMemberDto> {
	const res = await axiosRequest.post<FundMemberDto>(`/funds/${fundId}/members`, payload)
	return res.data
}

export async function removeFundMember(fundId: string, userId: string): Promise<boolean> {
	await axiosRequest.delete(`/funds/${fundId}/members/${userId}`)
	return true
}