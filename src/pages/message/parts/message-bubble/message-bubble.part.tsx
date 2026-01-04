import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { RainbowSpinner } from "@/components/ui/rainbow-spinner";
import { formatCurrency } from "@/lib/currency.lib";
import { WALLETS_UI } from "@/pages/message/message.constant";
import { formatNumber } from "@/common/utils/number.utils";

interface Props {
  msg: any;
  onRetry?: (msg: any) => void;
  onEditPrompt?: (msg: any) => void;
  onOpenEditDialog?: (msg: any) => void;
  isCurrentUser: boolean;
  walletName?: string;
}

const MessageBubblePart: React.FC<Props> = ({
  msg,
  onRetry,
  onEditPrompt,
  onOpenEditDialog,
  isCurrentUser,
  walletName,
}) => {
  const walletInfo = WALLETS_UI.find((w) => w.id === "momo") || WALLETS_UI[0];

  if (!isCurrentUser) {
    return (
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm ${
          msg.status === "error"
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
        ${
          isAnalyzing
            ? "bg-white border-indigo-100 ring-2 ring-indigo-50/50"
            : ""
        }
        ${
          isDone
            ? msg.transType === "expense"
              ? "bg-white border-rose-100 text-gray-700 hover:shadow-rose-100/50"
              : "bg-white border-emerald-100 text-gray-700 hover:shadow-emerald-100/50"
            : ""
        }
        ${
          isError
            ? "bg-red-50 border-red-200 text-gray-800 hover:bg-red-100/50 cursor-pointer"
            : ""
        }
      `}
    >
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-dashed border-gray-100 gap-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
          {walletInfo?.icon} {walletName || walletInfo?.name}
        </span>

        <div className="flex items-center">
          {isAnalyzing && (
            <div className="flex items-center gap-2 animate-pulse">
              <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                AI Phân tích...
              </span>
              <RainbowSpinner size="w-3 h-3" />
            </div>
          )}

          {isDone && (
            <span
              className={`text-[10px] uppercase font-bold flex items-center gap-1.5 animate-in zoom-in duration-300 ${
                msg.transType === "expense"
                  ? "text-rose-500"
                  : "text-emerald-500"
              }`}
            >
              {msg.category}
            </span>
          )}

          {isError && (
            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
              <AlertCircle size={12} />{" "}
              {isNetworkError ? "Lỗi mạng" : "Capy đang bối rối..."}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end gap-6">
        <span className="text-gray-700 leading-relaxed">{msg.text}</span>

        {isDone && msg.rawAmount > 0 && (
          <span
            className={`font-bold text-base whitespace-nowrap tracking-tight ${
              msg.transType === "expense" ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {msg.transType === "expense" ? "-" : "+"}
            {formatNumber(msg.rawAmount)}
          </span>
        )}
      </div>

      {isError && (
        <div className="mt-2 pt-2 border-t border-red-200/50 text-[10px] font-bold text-red-600 flex items-center gap-1 justify-end">
          <RefreshCw size={10} />{" "}
          {isNetworkError ? "Bấm để thử lại" : "Sửa prompt"}
        </div>
      )}
    </div>
  );
};

export default MessageBubblePart;
