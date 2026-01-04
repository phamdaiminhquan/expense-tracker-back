import React from "react";
import { ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletFormProps {
  onBack: () => void;
  onSubmit: () => void;
  formName: string;
  setFormName: (name: string) => void;
  formBalance: number | string;
  setFormBalance: (balance: number | string) => void;
  chosenTemplate: any;
  loading: boolean;
}

export const WalletForm: React.FC<WalletFormProps> = ({
  onBack,
  onSubmit,
  formName,
  setFormName,
  formBalance,
  setFormBalance,
  chosenTemplate,
  loading,
}) => {
  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-gray-400 hover:text-gray-800"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-lg font-bold text-gray-800">Thiết lập ví</h3>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex justify-center mb-6">
          <img
            src={chosenTemplate?.img}
            alt={chosenTemplate.name}
            className="w-20 h-20 object-contain"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
            Tên hiển thị
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder={chosenTemplate?.name}
            className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 font-semibold focus:ring-2 focus:ring-indigo-100 outline-none border border-transparent focus:border-indigo-200 transition-all"
          />
          <p className="text-[10px] text-gray-400 ml-1">
            Ví dụ: MoMo Cá nhân, VCB Lương...
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
            Số dư hiện tại
          </label>
          <div className="relative">
            <input
              type="number"
              value={formBalance}
              onChange={(e) => setFormBalance(e.target.value)}
              className="w-full p-4 pl-4 pr-12 bg-gray-50 rounded-2xl text-gray-800 font-bold text-lg focus:ring-2 focus:ring-emerald-100 outline-none border border-transparent focus:border-emerald-200 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              VNĐ
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            "Đang tạo..."
          ) : (
            <>
              <Check size={20} /> Tạo ví ngay
            </>
          )}
        </Button>
      </div>
    </React.Fragment>
  );
};
