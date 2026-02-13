import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { RainbowSpinner } from "@/components/ui/rainbow-spinner";
import { formatCurrency } from "@/common/lib/currency.lib";
import { WALLETS_UI, WALLET_TEMPLATES, CATEGORIES_UI } from "@/pages/message/message.constant";
import { formatNumber } from "@/common/utils/number.utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface Props {
  msg: any;
  onRetry?: (msg: any) => void;
  onEditPrompt?: (msg: any) => void;
  onOpenEditDialog?: (msg: any) => void;
  isCurrentUser: boolean;
  walletName?: string;
  walletColor?: string;
  walletIcon?: string;
  display?: {
    showHeader?: boolean;
    showWallet?: boolean;
    showStatus?: boolean;
    showAmount?: boolean;
    showCategory?: boolean;
  };
}

const MessageBubblePart: React.FC<Props> = ({
  msg,
  onRetry,
  onEditPrompt,
  onOpenEditDialog,
  isCurrentUser,
  walletName,
  walletColor,
  walletIcon,
  display,
}) => {
  const walletTemplate = WALLET_TEMPLATES.find((t) => t.code === walletIcon) || WALLET_TEMPLATES[0];

  const getCategoryIcon = () => {
    if (!msg.categoryIcon) return null;

    // 1. Thử tìm icon động từ Lucide dựa trên tên BE trả về
    const iconName = msg.categoryIcon
      .split("-")
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    const DynamicIcon = (LucideIcons as any)[iconName];
    if (DynamicIcon) {
      return <DynamicIcon size={16} />;
    }

    // 2. Nếu không thấy, tìm trong CATEGORIES_UI (fallback)
    const allCategories = [...CATEGORIES_UI.expense, ...CATEGORIES_UI.income];
    const found = allCategories.find(c => c.id === msg.categoryIcon);
    return found?.icon || null;
  };

  if (!isCurrentUser) {
    return (
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm ${msg.status === "error"
          ? "bg-orange-50 text-orange-600 border border-orange-100"
          : "bg-gray-100 text-gray-600"
          }`}
      >
        {msg.status === "error" && (
          <AlertCircle size={16} className="inline mr-1 -mt-0.5" />
        )}
        {msg.text}
      </div>
    );
  }

  const isNetworkError = msg.status === "network_error";
  const isAIError = msg.status === "ai_error";
  const isError = isNetworkError || isAIError || msg.status === "error";
  const isAnalyzing = msg.status === "analyzing";
  const isDone = msg.status === "done";

  const showHeader = display?.showHeader !== false;
  const showWallet = display?.showWallet !== false;
  const showStatus = display?.showStatus !== false;
  const showAmount = display?.showAmount !== false;
  const showCategory = display?.showCategory !== false;
  const showSecondaryRow = showWallet || showAmount || showCategory;

  const handleClick = () => {
    if (onOpenEditDialog) {
      onOpenEditDialog?.(msg);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`
        relative max-w-[85%] min-w-[200px] px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-500 border group
        rounded-tr-sm
        ${isAnalyzing
          ? "bg-white border-indigo-100 ring-2 ring-indigo-50/50"
          : ""
        }
        ${isDone
          ? msg.transType === "expense"
            ? "bg-white border-rose-100 text-gray-700 hover:shadow-rose-100/50"
            : "bg-white border-emerald-100 text-gray-700 hover:shadow-emerald-100/50"
          : ""
        }
        ${isError
          ? "bg-red-50 border-red-200 text-gray-800 hover:bg-red-100/50 cursor-pointer"
          : ""
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-gray-700 leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300">
          {msg.text}
        </span>

        {showHeader && (
          <div className="flex items-center">
            {showStatus && isAnalyzing && (
              <div className="flex items-center gap-2 animate-pulse">
                <span className="text-2xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                  AI Phân tích...
                </span>
                <RainbowSpinner size="w-3 h-3" />
              </div>
            )}

            {isError && (
              <span className="text-2xs font-bold text-red-500 flex items-center gap-1 animate-pulse">
                <AlertCircle size={12} />{" "}
                {isNetworkError ? "Lỗi mạng" : "Capy đang bối rối..."}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${showSecondaryRow ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          className={`mt-2 pt-2 border-t border-dashed border-gray-100 grid grid-cols-[1fr_auto_auto] items-center gap-4 transition-opacity duration-500 ease-in-out ${showSecondaryRow ? "opacity-100" : "opacity-0"}`}
        >
          {showWallet ? (
            <span className="text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in duration-500">
              <img
                src={walletTemplate?.img}
                alt={walletName}
                className="w-3.5 h-3.5 object-contain"
              />
              <span style={{ color: walletColor || "#9ca3af" }}>
                {walletName || "Ví nguồn"}
              </span>
            </span>
          ) : (
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">&nbsp;</span>
          )}

          {showAmount && (isDone || (isAnalyzing && msg.rawAmount > 0)) && (
            <span
              className={`font-bold text-base whitespace-nowrap tracking-tight flex items-center animate-in fade-in duration-500 ${msg.transType === "expense" ? "text-rose-600" : "text-emerald-600"
                } ${isAnalyzing ? "opacity-70 saturate-50" : ""}`}
              title={isAnalyzing ? "Số tiền dự đoán (Client)" : ""}
            >
              <AnimatedNumber
                value={msg.rawAmount}
                prefix={msg.transType === "expense" ? "-" : "+"}
              />
            </span>
          )}

          {showCategory && isDone && (
            <span
              className={`text-2xs uppercase font-bold flex items-center gap-1.5 animate-in fade-in duration-500 ${msg.transType === "expense"
                ? "text-rose-500"
                : "text-emerald-500"
                }`}
            >
              {getCategoryIcon()}
              {msg.category}
            </span>
          )}
        </div>
      </div>

      {isError && (
        <div className="mt-2 pt-2 border-t border-red-200/50 text-2xs font-bold text-red-600 flex items-center gap-1 justify-end">
          <RefreshCw size={10} />{" "}
          {isNetworkError ? "Bấm để thử lại" : "Sửa prompt"}
        </div>
      )}
    </div>
  );
};

export default MessageBubblePart;
