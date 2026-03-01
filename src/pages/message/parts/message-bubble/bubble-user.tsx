/**
 * BubbleUser
 * ────────────────────────────────────────────────────────────────────────────
 * Bubble cho tin nhắn của CHÍNH người dùng hiện tại.
 *
 * Điểm khác biệt so với OtherBubble:
 *   • Căn phải (align="right")
 *   • Hiển thị wallet tag ở secondary row bên trái
 *   • Click để mở edit dialog
 *   • Màu nền: trắng với viền rose/emerald/indigo tuỳ trạng thái
 */

import React from "react";
import { BubbleShell } from "./bubble-shell";
import { BubbleContent } from "./bubble-content";
import { BubbleMsg, BubbleColorTokens } from "./bubble.types";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";

const USER_COLOR_TOKENS: BubbleColorTokens = {
  analyzing: "bg-white border-indigo-100 ring-2 ring-indigo-50/50",
  doneExpense: "bg-white border-rose-100 text-gray-700 hover:shadow-rose-100/50",
  doneIncome: "bg-white border-emerald-100 text-gray-700 hover:shadow-emerald-100/50",
  error: "bg-red-50 border-red-200 text-gray-800 hover:bg-red-100/50",
  default: "bg-white border-border text-gray-700",
};

interface BubbleUserProps {
  msg: BubbleMsg;
  walletName?: string;
  walletColor?: string;
  walletIcon?: string;
  onOpenEditDialog?: (msg: BubbleMsg) => void;
  onRetry?: (msg: BubbleMsg) => void;
  showAmount?: boolean;
  showCategory?: boolean;
  showStatus?: boolean;
  showWallet?: boolean;
}

export function BubbleUser({
  msg,
  walletName,
  walletColor,
  walletIcon,
  onOpenEditDialog,
  showAmount = true,
  showCategory = true,
  showStatus = true,
  showWallet = true,
}: BubbleUserProps) {
  const walletTemplate =
    WALLET_TEMPLATES.find((t) => t.code === walletIcon) || WALLET_TEMPLATES[0];

  const walletSlot = showWallet ? (
    <>
      <img
        src={walletTemplate?.img}
        alt={walletName}
        className="w-3.5 h-3.5 object-contain"
      />
      <span style={{ color: walletColor || "#9ca3af" }}>
        {walletName || "Ví nguồn"}
      </span>
    </>
  ) : null;

  return (
    <BubbleShell
      align="right"
      status={msg.status}
      colorTokens={USER_COLOR_TOKENS}
      transType={msg.transType}
      onClick={() => onOpenEditDialog?.(msg)}
    >
      <BubbleContent
        msg={msg}
        secondaryLeft={walletSlot}
        showAmount={showAmount}
        showCategory={showCategory}
        showStatus={showStatus}
      />
    </BubbleShell>
  );
}
