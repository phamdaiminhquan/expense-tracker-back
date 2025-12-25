import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { getListFunds, createFund as apiCreateFund, getFund, updateFund as apiUpdateFund, deleteFund as apiDeleteFund } from '@/apis/funds/fund.api';
import { GetListFundDto, CreateFundDto, UpdateFundDto } from '@/apis/funds/fund.interface';
import { toast } from 'sonner';

export const useFund = (params?: GetListFundDto, fundId?: string) => {
  const [loading, setLoading] = useState(false);

  // Fetch list funds
  const {
    data: fundList,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useSWR(
    params ? 'funds' + JSON.stringify(params) : null,
    async () => await getListFunds(params!),
    { 
      keepPreviousData: true, 
      revalidateOnFocus: false 
    },
  );

  const {
    data: fund,
    isLoading: isLoadingFund,
    mutate: mutateFund,
  } = useSWR(
    fundId ? `funds/${fundId}` : null,
    async () => await getFund(fundId!),
    { revalidateOnFocus: false },
  );

  // Create fund
  const createFund = useCallback(
    async (values: CreateFundDto) => {
      setLoading(true);
      try {
        const newFund = await apiCreateFund(values);
        toast.success('Đã tạo quỹ thành công!', { description: values.name });
        mutateList();
        return newFund;
      } catch (error: any) {
        toast.error('Tạo quỹ thất bại', { 
          description: error?.message || 'Vui lòng thử lại' 
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutateList],
  );

  // Update fund
  const updateFund = useCallback(
    async (id: string, values: UpdateFundDto) => {
      setLoading(true);
      try {
        const updatedFund = await apiUpdateFund(id, values);
        toast.success('Cập nhật quỹ thành công!', { description: values.name });
        mutateList();
        mutateFund();
        return updatedFund;
      } catch (error: any) {
        toast.error('Cập nhật quỹ thất bại', { 
          description: error?.message || 'Vui lòng thử lại' 
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutateList, mutateFund],
  );

  // Delete fund
  const deleteFund = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await apiDeleteFund(id);
        toast.success('Đã xóa quỹ thành công!');
        mutateList();
        return true;
      } catch (error: any) {
        toast.error('Xóa quỹ thất bại', { 
          description: error?.message || 'Vui lòng thử lại' 
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [mutateList],
  );

  return {
    fundList,       
    fund,
    
    isLoadingList,
    isLoadingFund,
    loading,
    
    createFund,
    updateFund,
    deleteFund,
    
    mutateList,
    mutateFund,
  };
};