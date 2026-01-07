import React from "react";
import {
  ChevronLeft,
  Banknote,
  Wallet as WalletIcon,
  CreditCard,
} from "lucide-react";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";

interface WalletTemplatesProps {
  onBack: () => void;
  onSelectTemplate: (template: any) => void;
  canGoBack: boolean;
}

export const WalletTemplates: React.FC<WalletTemplatesProps> = ({
  onBack,
  onSelectTemplate,
  canGoBack,
}) => {
  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`p-1 -ml-1 transition-colors ${
              canGoBack
                ? "text-gray-400 hover:text-gray-800"
                : "text-gray-200 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-lg font-bold text-gray-800">Thêm ví mới</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-6">
        {WALLET_TEMPLATES.map((tpl) => {
          let Icon = Banknote;
          if (tpl.icon === "wallet") Icon = WalletIcon;
          if (tpl.icon === "card") Icon = CreditCard;
          return (
            <button
              key={tpl.code}
              onClick={() => onSelectTemplate(tpl)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
            >
              <img
                src={tpl.img}
                alt={tpl.name}
                className="w-10 h-10 object-contain"
              />
              <div className="font-bold text-xs text-gray-700">{tpl.name}</div>
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );
};
