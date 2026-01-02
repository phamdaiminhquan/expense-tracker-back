import React from "react";
import { Plus, Wallet as WalletIcon, CreditCard, Banknote, Check, Edit3, Trash } from "lucide-react";
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
    <>
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

      <div className="grid grid-cols-1 gap-3 overflow-y-auto pb-6 flex-1">
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
              <div key={w.id} className="relative group">
                <button
                  onClick={() => {
                    onSelect(w.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all overflow-hidden text-left ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-500 shadow-sm"
                      : "bg-white border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center `}
                    style={{
                      backgroundColor: style?.bgLight || "#F9FAFB",
                      color: style?.text || "#374151",
                    }}
                  >
                    {style?.icon === "wallet" ? (
                      <WalletIcon size={20} />
                    ) : style?.icon === "card" ? (
                      <CreditCard size={20} />
                    ) : (
                      <Banknote size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm">
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
                  {isSelected && (
                    <div className="bg-indigo-500 text-white p-1 rounded-full">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>

                <button className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-indigo-500 transition-colors">
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(w.id)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  <Trash size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
