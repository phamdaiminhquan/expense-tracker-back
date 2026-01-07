import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { getFund, joinFundRequest } from "@/apis/funds/fund.api";
import { useAuth } from "@/hooks/use-auth.hook";
import { Users, Crown, UserPlus, Bell } from "lucide-react";
import { formatCurrency } from "@/lib/currency.lib";
import { toast } from "sonner";
import LoadingScreenZen from "@/components/elements/screen/screen-loading-zen.element";
import { Button } from "@/components/ui/button";

export function InvitePage() {
    const { fundId } = useParams();
    const navigate = useNavigate();
    const { isAuthed, currentUserId } = useAuth();
    const [isJoining, setIsJoining] = useState(false);

    // Fetch fund info
    const { data: fund, isLoading, error } = useSWR(
        fundId ? `public-fund-${fundId}` : null,
        async () => await getFund(fundId!)
    );

    const handleJoin = async () => {
        if (!isAuthed) {
            // Redirect to login with return URL
            const returnUrl = encodeURIComponent(window.location.pathname);
            navigate(`/login?returnUrl=${returnUrl}`);
            return;
        }

        if (!fundId) return;

        try {
            setIsJoining(true);
            await joinFundRequest(fundId);
            toast.success("Đã gửi yêu cầu tham gia thành công!", {
                description: "Vui lòng chờ quản trị viên phê duyệt.",
            });
            // Navigate to main chat (dashboard), not the fund (since not approved yet)
            navigate(`/chat`);
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 409) {
                toast.info("Bạn đã gửi yêu cầu tham gia rồi.");
                navigate(`/chat`);
            } else if (status === 403) {
                 toast.info("Bạn đã là thành viên của quỹ này.");
                 navigate(`/chat/${fundId}`);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } finally {
            setIsJoining(false);
        }
    };

    const handleLogin = () => {
        const returnUrl = encodeURIComponent(window.location.pathname);
        navigate(`/login?returnUrl=${returnUrl}`);
    };

    if (isLoading) return <LoadingScreenZen isLoading={true} />;

    if (error || !fund) {
         return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy quỹ</h2>
                    <p className="text-gray-500 mb-6">Đường dẫn tham gia không hợp lệ hoặc quỹ đã bị xóa.</p>
                    <Button onClick={() => navigate("/")} variant="outline">
                        Về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    // Check if user is already a member (if logged in and data available)
    // Note: getFund usually returns public info if 403 for members/non-members?
    // Based on previous context, getFund returns public info or throws 403.
    // If it returns data, we show it.

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-md w-full">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 bg-linear-to-b from-blue-50/50">
                    <div className="flex gap-4 items-start">
                         <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center shrink-0">
                            <Users className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                {fund.name}
                            </h1>
                            <div className="flex items-center gap-1.5 mt-2 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                                <Crown className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-wider">Quỹ chia sẻ</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
                            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Thành viên</p>
                            <p className="text-xl font-bold text-gray-900">
                                {fund.memberCount || 0}
                            </p>
                        </div>
                         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
                            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Tổng quỹ</p>
                             <p className="text-xl font-bold text-emerald-600">
                                {formatCurrency(fund.totalBalance || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                         <p className="text-gray-600 italic leading-relaxed text-center">
                            “{fund.description || "Quỹ này chưa có mô tả."}”
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                             <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                                <Bell className="w-3.5 h-3.5 text-blue-600" />
                             </div>
                            <p className="text-sm text-blue-900">
                                Khi tham gia, bạn sẽ có quyền xem lịch sử giao dịch và đóng góp vào quỹ.
                            </p>
                        </div>

                        {isAuthed ? (
                            <button
                                onClick={handleJoin}
                                disabled={isJoining}
                                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                <UserPlus size={20} />
                                {isJoining ? "Đang xử lý..." : "Tham gia ngay"}
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                     onClick={handleLogin}
                                     className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                >
                                    Đăng nhập để tham gia
                                </button>
                                <p className="text-xs text-center text-gray-400">
                                    Bạn cần có tài khoản để tham gia vào quỹ này
                                </p>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full py-4 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Để sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
