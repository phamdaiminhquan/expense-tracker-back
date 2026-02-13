import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { getFundMembers, removeFundMember } from '@/apis/funds/fund.api';
import { toast } from 'sonner';
import { GetListFundMemberDto } from '@/apis/funds/fund.interface';
import { getErrorMessage } from '@/common/utils/error.utils';

export const useFundMembers = (fundId: string, params?: GetListFundMemberDto) => {
    const [loading, setLoading] = useState(false);

    const { data, isLoading, mutate, error } = useSWR(
        fundId ? ['fundMembers', fundId, params] : null,
        () => getFundMembers(fundId, params!),
        { keepPreviousData: true, revalidateOnFocus: false }
    );

    const removeMember = useCallback(
        async (memberId: string) => {
            setLoading(true);
            try {
                await removeFundMember(fundId, memberId);
                toast.success('Đã xóa thành viên!');
                mutate();
            } catch (error: unknown) {
                toast.error('Xóa thành viên thất bại', { description: getErrorMessage(error) });
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
        // inviteMember,
        removeMember,
        mutate,
    };
};
