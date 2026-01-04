import React, { ReactNode } from "react";
import { Sparkles, TrendingUp, Menu, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { BellNotification } from "@/components/components-mui/bell/bell.component";
import { RequestFundItem } from "@/components/JoinFundRequestDialog";
import { formatNumber } from "@/common/utils/number.utils";

interface Props {
  totalExpense: number;
  totalIncome: number;
  onOpenSidebar: () => void;
  isSmartMode: boolean;
  onToggleSmart: () => void;
  fundName?: string;
  onShowStatistics: () => void;
  onShareFund: () => void;
}

const MessageHeaderPart: React.FC<Props> = ({
  totalExpense,
  totalIncome,
  onOpenSidebar,
  isSmartMode,
  onToggleSmart,
  fundName,
  onShowStatistics,
  onShareFund,
}) => {

  const createMockRequest = (id: number, name: string, tag: string, message: string) => {
    const now = new Date();
    const createdAt = new Date(Date.now() - (id * 3600000));

    return {
      fundId: `fund-123`,
      userId: `user-${id}`,
      status: 'PENDING',
      tag: tag,
      userEmail: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      message: message,
      createdAt: createdAt,
      user: {
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        id: `user-${id}`,
        createdAt: now,
        updatedAt: now
      },
      id: `request-${id}`,
      updatedAt: now
    };
  };


  const requests: ReactNode[] = [
    <RequestFundItem
      key="1"
      request={createMockRequest(1, "Nguyễn Văn A", "XIN LÀM MEMBER", "Cho tui vô kẻ với, hứa đóng tiền đúng hạn!")}
      onApprove={() => console.log('Duyệt Nguyễn Văn A')} // approve tai day
      onReject={() => console.log('Từ chối Nguyễn Văn A')} // reject tai day
    />,
    <RequestFundItem
      key="2"
      request={createMockRequest(2, "Trần Thị B", "XIN FOLLOW", "Xin follow để hỏng biến chi tiêu 🌟")}
      onApprove={() => console.log('Duyệt Trần Thị B')}
      onReject={() => console.log('Từ chối Trần Thị B')}
    />
  ];
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
            <h2 className="text-[9px] lg:text-[10px] font-bold text-gray-400 lg:tracking-[0.2em] tracking-widest uppercase mb-0.5">
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
            className={`flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all border 
               ${isSmartMode
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
          >
            {isSmartMode && <Sparkles size={10} />}{" "}
            {isSmartMode ? "AI PRO" : "BASIC"}
          </button>

          <button
            onClick={onShareFund}
            className={`flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer hover:bg-gray-900 hover:text-white ${!fundName ? 'hidden' : 'block'}`}
          >
            <Share2 size={12} /> Chia sẻ
          </button>

          <BellNotification
            unreadCount={2}
            requests={requests}
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
          <div className="text-[8px] lg:text-[9px] uppercase tracking-wider text-rose-500 font-bold mb-0.5 opacity-80">
            Chi tiêu
          </div>
          <div className="text-lg lg:text-xl font-black text-gray-800 tracking-tight">
            {formatNumber(totalExpense)}
          </div>
        </div>
        <div className="transition-all duration-300">
          <div className="text-[8px] lg:text-[9px] uppercase tracking-wider text-emerald-600 font-bold mb-0.5 opacity-80">
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
