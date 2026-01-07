import React, { useMemo } from "react";
import { Sparkles, TrendingUp, Menu, Share2 } from "lucide-react";
import { BellComponent, BellItem } from "@/components/components-mui/bell/bell.component";
import { formatNumber } from "@/common/utils/number.utils";
import { useFund } from "@/app/providers/FundProvider";

interface Props {
  totalExpense: number;
  totalIncome: number;
  onOpenSidebar: () => void;
  isSmartMode: boolean;
  onToggleSmart: () => void;
  fundName?: string;
  fundId?: string,
  onShowStatistics: () => void;
  onOpenShareFundDialog: () => void;
}


const MessageHeaderPart: React.FC<Props> = ({
  totalExpense,
  totalIncome,
  onOpenSidebar,
  isSmartMode,
  onToggleSmart,
  fundName,
  fundId,
  onShowStatistics,
  onOpenShareFundDialog,
}) => {
  const {
    joinRequests,
    approveRequest,
    rejectRequest,
  } = useFund(undefined, fundId)

  const bellItems: BellItem[] = useMemo(() => {
    if (!joinRequests || joinRequests.length === 0) return []

    return joinRequests.map((req) => ({
      id: req.id,
      type: 'FUND_REQUEST',
      payload: {
        id: req.id,
        name: req.user?.name ?? 'User',
        message: 'Yêu cầu tham gia quỹ',
        time: req.createdAt,
        fundType: 'MEMBER', // fix cứng chờ BE
        onApprove: () => approveRequest(req.id),
        onReject: () => rejectRequest(req.id),
      },
    }))
  }, [joinRequests, approveRequest, rejectRequest])





  return (
    <div className="lg:pt-6 lg:pb-4 lg:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 px-4 bg-white/90 backdrop-blur-md border-b border-gray-100 z-20 shrink-0">
      <div className="flex justify-between items-center mb-3 lg:mb-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-2xs lg:text-2xs font-bold text-gray-400 lg:tracking-[0.2em] tracking-widest uppercase mb-0.5">
              {fundName || "Tổng quan"}
            </h2>
            <div className="text-xs lg:text-sm font-bold text-gray-800">
              Giao dịch hôm nay
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSmart}
            className={`flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-2xs lg:text-2xs font-bold uppercase tracking-wider transition-all border cursor-pointer
              ${isSmartMode
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
          >
            {isSmartMode && <Sparkles size={10} />}{" "}
            {isSmartMode ? "AI PRO" : "BASIC"}
          </button>

          <button
            onClick={onOpenShareFundDialog}
            className={`flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-2xs lg:text-2xs font-bold uppercase tracking-wider transition-all border cursor-pointer hover:bg-black hover:text-white ${!fundName ? 'hidden' : 'block'}`}
          >
            <Share2 size={12} /> Chia sẻ
          </button>

          <BellComponent
            title="Thông báo"
            count={bellItems.length}
            items={bellItems}
          />

          <button
            onClick={onShowStatistics}
            className="xl:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <TrendingUp size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-10 px-1">
        <div className="transition-all duration-300">
          <div className="text-3xs lg:text-3xs uppercase tracking-wider text-rose-500 font-bold mb-0.5 opacity-80">
            Chi tiêu
          </div>
          <div className="text-lg lg:text-xl font-black text-gray-800 tracking-tight">
            {formatNumber(totalExpense)}
          </div>
        </div>
        <div className="transition-all duration-300">
          <div className="text-3xs lg:text-3xs uppercase tracking-wider text-emerald-600 font-bold mb-0.5 opacity-80">
            Thu nhập
          </div>
          <div className="text-lg lg:text-xl font-black text-gray-800 tracking-tight">
            {formatNumber(totalIncome)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageHeaderPart;
