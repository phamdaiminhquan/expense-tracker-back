import React from "react";
import {
  Plus,
  Wallet as WalletIcon,
  CreditCard,
  Banknote,
  Check,
  Edit3,
  Trash,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";

interface WalletListProps {
  data: any;
  selectedWalletId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export const WalletList: React.FC<WalletListProps> = ({
  data,
  selectedWalletId,
  onSelect,
  onDelete,
  onAddNew,
  onClose,
}) => {
  const hasWallets = data?.data && data.data.length > 0;

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="text-lg font-bold text-gray-800">Chọn ví nguồn</h3>
        <button
          onClick={onAddNew}
          className={`p-2 rounded-full transition-colors ${
            !hasWallets
              ? "bg-indigo-100 text-indigo-600 animate-pulse ring-2 ring-indigo-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pb-6 flex-1">
        {!hasWallets ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <WalletIcon size={32} />
            </div>
            <h4 className="text-gray-800 font-bold mb-1">Chưa có ví nào</h4>
            <p className="text-gray-500 text-sm mb-6 max-w-[200px]">
              Tạo ví đầu tiên để bắt đầu quản lý chi tiêu của bạn
            </p>
            <button
              onClick={onAddNew}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} />
              Tạo ví ngay
            </button>
          </div>
        ) : (
          data?.data.map((w: any) => {
            const style =
              WALLET_TEMPLATES.find((t) => t.code === w.icon) ||
              WALLET_TEMPLATES.find((t) => t.code === "custom");
            const isSelected = selectedWalletId === w.id;

            return (
              <button
                key={w.id}
                onClick={() => {
                  onSelect(w.id);
                  onClose();
                }}
                className={`w-full h-20 flex items-center gap-4 px-4 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-500 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-300"
                }`}
              >
                {/* Icon ví */}
                <img src={style?.img} alt={w.name} className="w-10 h-10 object-contain" />

                {/* Thông tin ví */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-sm truncate">
                    {w.name}
                  </div>
                  <div
                    className={`text-xs font-medium mt-0.5 ${
                      isSelected ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    Số dư: {formatCurrency(w.balance || 0)}
                  </div>
                </div>

                {/* Actions bên phải */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className=" text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(w.id);
                    }}
                    className=" text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>

                  {isSelected && (
                    <div className="bg-indigo-500 text-white p-1 rounded-full">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </React.Fragment>
  );
};
