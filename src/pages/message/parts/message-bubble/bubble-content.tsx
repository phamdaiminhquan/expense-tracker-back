/**
 * BubbleContent
 * ────────────────────────────────────────────────────────────────────────────
 * Shared inner content của mọi bubble — chứa:
 *   • Text + status badge (header row)
 *   • Secondary row: [secondaryLeft slot] | [amount] | [category]
 *   • Error footer
 *
 * Variant component quyết định truyền gì vào secondaryLeft:
 *   - UserBubble   → <WalletTag />
 *   - OtherBubble  → null (hoặc <SenderName /> trong tương lai)
 *   - AIBubble     → <AIBadge /> ...
 */

import React from "react";
import * as LucideIcons from "lucide-react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { RainbowSpinner } from "@/components/ui/rainbow-spinner";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { CATEGORIES_UI } from "@/pages/message/message.constant";
import { BubbleMsg } from "./bubble.types";

interface BubbleContentProps {
  msg: BubbleMsg;
  /** Slot trái của secondary row — wallet, sender name, hoặc null */
  secondaryLeft?: React.ReactNode;
  showAmount?: boolean;
  showCategory?: boolean;
  showStatus?: boolean;
  /** Label lỗi khi network_error, override mặc định nếu cần */
  networkErrorLabel?: string;
  /** Label lỗi khi ai_error, override mặc định nếu cần */
  aiErrorLabel?: string;
}

/** Resolve category icon từ tên icon BE trả về (Lucide dynamic + fallback) */
function CategoryIcon({ iconName }: { iconName?: string }) {
  if (!iconName) return null;

  const pascalName = iconName
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

  const DynamicIcon = (LucideIcons as any)[pascalName];
  if (DynamicIcon) return <DynamicIcon size={16} />;

  const all = [...CATEGORIES_UI.expense, ...CATEGORIES_UI.income];
  const found = all.find((c) => c.id === iconName);
  return found?.icon ?? null;
}

export function BubbleContent({
  msg,
  secondaryLeft,
  showAmount = true,
  showCategory = true,
  showStatus = true,
  networkErrorLabel = "Lỗi mạng",
  aiErrorLabel = "Capy đang bối rối...",
}: BubbleContentProps) {
  const isNetworkError = msg.status === "network_error";
  const isAIError = msg.status === "ai_error";
  const isError =
    isNetworkError || isAIError || msg.status === "error";
  const isAnalyzing = msg.status === "analyzing";
  const isDone = msg.status === "done";

  const hasSecondaryLeft = secondaryLeft !== undefined && secondaryLeft !== null;
  const showAmountRow =
    showAmount && (isDone || (isAnalyzing && (msg.rawAmount ?? 0) > 0));
  const showCategoryRow = showCategory && isDone;
  const showSecondaryRow =
    hasSecondaryLeft || showAmountRow || showCategoryRow;

  return (
    <>
      {/* ── Header row: text + status badge ── */}
      <div className="flex items-start justify-between gap-4">
        <span className="min-w-0 break-words text-gray-700 leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300">
          {msg.text}
        </span>

        {showStatus && (
          <div className="flex items-center shrink-0">
            {isAnalyzing && (
              <div className="flex items-center gap-2 animate-pulse">
                <span className="text-2xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                  AI Phân tích...
                </span>
                <RainbowSpinner size="w-3 h-3" />
              </div>
            )}
            {isError && (
              <span className="text-2xs font-bold text-red-500 flex items-center gap-1 animate-pulse">
                <AlertCircle size={12} />
                {isNetworkError ? networkErrorLabel : aiErrorLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Secondary row: [left slot] | [amount] | [category] ── */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showSecondaryRow ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`mt-2 pt-2 border-t border-dashed border-gray-100 grid grid-cols-[1fr_auto_auto] items-center gap-4 transition-opacity duration-500 ease-in-out ${
            showSecondaryRow ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Left slot */}
          {hasSecondaryLeft ? (
            <span className="text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in duration-500">
              {secondaryLeft}
            </span>
          ) : (
            <span className="text-2xs text-muted-foreground">&nbsp;</span>
          )}

          {/* Amount */}
          {showAmountRow && (
            <span
              className={`font-bold text-base whitespace-nowrap tracking-tight flex items-center animate-in fade-in duration-500 ${
                msg.transType === "expense"
                  ? "text-rose-600"
                  : "text-emerald-600"
              } ${isAnalyzing ? "opacity-70 saturate-50" : ""}`}
              title={isAnalyzing ? "Số tiền dự đoán (Client)" : ""}
            >
              <AnimatedNumber
                value={msg.rawAmount ?? 0}
                prefix={msg.transType === "expense" ? "-" : "+"}
              />
            </span>
          )}

          {/* Category */}
          {showCategoryRow && (
            <span
              className={`text-2xs uppercase font-bold flex items-center gap-1.5 animate-in fade-in duration-500 ${
                msg.transType === "expense"
                  ? "text-rose-500"
                  : "text-emerald-500"
              }`}
            >
              <CategoryIcon iconName={msg.categoryIcon} />
              {msg.category}
            </span>
          )}
        </div>
      </div>

      {/* ── Error footer ── */}
      {isError && (
        <div className="mt-2 pt-2 border-t border-red-200/50 text-2xs font-bold text-red-600 flex items-center gap-1 justify-end">
          <RefreshCw size={10} />
          {isNetworkError ? "Bấm để thử lại" : "Sửa prompt"}
        </div>
      )}
    </>
  );
}
