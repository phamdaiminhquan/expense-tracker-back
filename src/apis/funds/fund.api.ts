import { axiosRequest } from '@/common/config/axios.config'
import { Fund } from '@/lib/types'
import {
	AddMemberPayload,
	CreateFundPayload,
	FundDto,
	FundMemberDto,
	UpdateFundPayload,
} from './fund.interface'

function mapFund(dto: FundDto): Fund {
	return {
		id: dto.id,
		name: dto.name,
		type: dto.type,
		ownerId: dto.ownerId,
		// Ensure owner is always included as member for access control
		memberIds: dto.memberIds && dto.memberIds.length > 0 ? dto.memberIds : [dto.ownerId],
		createdAt: typeof dto.createdAt === 'string' ? Date.parse(dto.createdAt) : dto.createdAt,
	}
}

export async function getListFunds(): Promise<Fund[]> {
	const res = await axiosRequest.get<FundDto[]>('/funds')
	return (res.data || []).map(mapFund)
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