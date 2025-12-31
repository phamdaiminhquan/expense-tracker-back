import { useState, useCallback } from 'react';
import useSWR from 'swr';
import {
    getFundMembers,
    addFundMember,
    removeFundMember,
} from '@/apis/funds/fund.api';
import { GetListFundMemberDto, AddMemberPayload, FundMemberDto } from '@/apis/funds/fund.interface';
import { toast } from 'sonner';

export const useFundMembers = (
    fundId: string,
    params?: GetListFundMemberDto
) => {
    const [loading, setLoading] = useState(false);

    const { data, isLoading, mutate, error } = useSWR<FundMemberDto[]>(
        fundId ? ['fundMembers', fundId, params] : null,
        () => getFundMembers(fundId, params!),
        { keepPreviousData: true, revalidateOnFocus: false }
    );

    const inviteMember = useCallback(
        async (payload: AddMemberPayload) => {
            setLoading(true);
            try {
                await addFundMember(fundId, payload);
                toast.success('Đã mời thành viên thành công!');
                mutate();
            } catch (error: any) {
                toast.error('Mời thành viên thất bại', { description: error?.message || 'Vui lòng thử lại' });
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [fundId, mutate]
    );

    const removeMember = useCallback(
        async (userId: string) => {
            setLoading(true);
            try {
                await removeFundMember(fundId, userId);
                toast.success('Đã xóa thành viên!');
                mutate();
            } catch (error: any) {
                toast.error('Xóa thành viên thất bại', { description: error?.message || 'Vui lòng thử lại' });
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [fundId, mutate]
    );

    return {
        members: data || [],
        isLoading,
        loading,
        error,
        inviteMember,
        removeMember,
        mutate,
    };
};
