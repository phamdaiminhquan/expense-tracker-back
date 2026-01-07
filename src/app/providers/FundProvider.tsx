import { useState, useCallback } from 'react'
import useSWR from 'swr'
import {
  getListFunds,
  createFund as apiCreateFund,
  getFund,
  updateFund as apiUpdateFund,
  deleteFund as apiDeleteFund,
  joinFundRequest,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from '@/apis/funds/fund.api'
import {
  GetListFundDto,
  CreateFundDto,
  UpdateFundDto,
} from '@/apis/funds/fund.interface'
import { toast } from 'sonner'
import { JoinFundStatus } from '@/apis/funds/fund.enum'
import { useAuth } from '@/hooks/use-auth.hook'


export const useFund = (params?: GetListFundDto, fundId?: string) => {
  const [loading, setLoading] = useState(false)
  const [needJoinFund, setNeedJoinFund] = useState(false)
  const { currentUser } = useAuth()

  const {
    data: fundList,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useSWR(
    params ? ['funds', params] : null,
    () => getListFunds(params!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )

  const {
    data: fund,
    isLoading: isLoadingFund,
    mutate: mutateFund,
  } = useSWR(
    fundId ? ['fund', fundId] : null,
    async () => {
      try {
        const res = await getFund(fundId!)
        // Backend trả về public site (có memberCount) khi user chưa là thành viên
        if (res.memberCount !== undefined) {
          setNeedJoinFund(true)
        } else {
          setNeedJoinFund(false)
        }
        return res
      } catch (error: any) {
        // Trường hợp BE trả về 403 thay vì public site
        if (error?.response?.status === 403) {
          setNeedJoinFund(true)
        }
        throw error
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  )

  const {
    data: joinRequests,
    isLoading: isLoadingJoinRequests,
    mutate: mutateJoinRequests,
  } = useSWR(
    fundId && currentUser && fund?.ownerId === currentUser.id
      ? ['fund-join-requests', fundId, JoinFundStatus.PENDING]
      : null,
    () => getJoinRequests(fundId!, { status: JoinFundStatus.PENDING }),
    { revalidateOnFocus: false }
  )

  const approveRequest = useCallback(
    async (requestId: string) => {
      if (!fundId) return false
      setLoading(true)

      try {
        await approveJoinRequest(fundId, requestId)
        toast.success('Đã chấp nhận yêu cầu tham gia quỹ')
        mutateJoinRequests()
        mutateFund()
        return true
      } catch (error) {
        toast.error('Chấp nhận thất bại')
        return false
      } finally {
        setLoading(false)
      }
    },
    [fundId, mutateJoinRequests, mutateFund]
  )

  const rejectRequest = useCallback(
    async (requestId: string) => {
      if (!fundId) return false
      setLoading(true)

      try {
        await rejectJoinRequest(fundId, requestId)
        toast.success('Đã từ chối yêu cầu tham gia quỹ')
        mutateJoinRequests()
        return true
      } catch (error) {
        toast.error('Từ chối thất bại')
        return false
      } finally {
        setLoading(false)
      }
    },
    [fundId, mutateJoinRequests]
  )

  const createFund = useCallback(
    async (values: CreateFundDto) => {
      setLoading(true)
      try {
        const newFund = await apiCreateFund(values)
        toast.success('Đã tạo quỹ thành công!', {
          description: values.name,
        })
        mutateList()
        return newFund
      } catch (error: any) {
        toast.error('Tạo quỹ thất bại', {
          description: error?.message || 'Vui lòng thử lại',
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [mutateList]
  )

  const updateFund = useCallback(
    async (id: string, values: UpdateFundDto) => {
      setLoading(true)
      try {
        const updatedFund = await apiUpdateFund(id, values)
        toast.success('Cập nhật quỹ thành công!', {
          description: values.name,
        })
        mutateList()
        mutateFund()
        return updatedFund
      } catch (error: any) {
        toast.error('Cập nhật quỹ thất bại', {
          description: error?.message || 'Vui lòng thử lại',
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [mutateList, mutateFund]
  )

  const deleteFund = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        await apiDeleteFund(id)
        toast.success('Đã xóa quỹ thành công!')
        mutateList()
        return true
      } catch (error: any) {
        toast.error('Xóa quỹ thất bại', {
          description: error?.message || 'Vui lòng thử lại',
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [mutateList]
  )

  const joinFund = useCallback(
    async (fundId: string) => {
      setLoading(true)
      try {
        await joinFundRequest(fundId)

        toast.success('Gửi yêu cầu tham gia quỹ thành công!', {
          description: 'Vui lòng chờ quản trị viên duyệt',
        })

        mutateList()
        return true
      } catch (error: any) {
        const status = error?.response?.status

        if (status === 409) {
          toast.info('Bạn đã gửi yêu cầu tham gia quỹ trước đó')
        } else if (status === 403) {
          toast.error('Bạn không có quyền tham gia quỹ này')
        } else {
          toast.error('Gửi yêu cầu tham gia thất bại')
        }

        return false
      } finally {
        setLoading(false)
      }
    },
    [mutateList]
  )


  return {
    // data
    fundList,
    fund,
    joinRequests,

    // loading
    isLoadingList,
    isLoadingFund,
    isLoadingJoinRequests,
    loading,

    // state
    needJoinFund,
    setNeedJoinFund,

    // actions
    createFund,
    updateFund,
    deleteFund,
    joinFund,
    approveRequest,
    rejectRequest,

    // mutate
    mutateList,
    mutateFund,
    mutateJoinRequests,
  }
}
