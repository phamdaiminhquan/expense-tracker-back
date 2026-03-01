/**
 * BubbleOther
 * ────────────────────────────────────────────────────────────────────────────
 * Bubble cho tin nhắn của NGƯỜI KHÁC trong quỹ.
 *
 * Điểm khác biệt so với UserBubble:
 *   • Căn trái (align="left")
 *   • KHÔNG hiển thị wallet (người dùng không cần thấy ví của người khác)
 *   • KHÔNG có click để edit
 *   • Màu nền: xám nhạt (neutral tone) thay vì trắng với viền màu
 *   • Trong tương lai: slot trái có thể hiện sender name / avatar
 */

import React from "react";
import { BubbleShell } from "./bubble-shell";
import { BubbleContent } from "./bubble-content";
import { BubbleMsg, BubbleColorTokens } from "./bubble.types";

const OTHER_COLOR_TOKENS: BubbleColorTokens = {
  analyzing: "bg-gray-50 border-gray-200 ring-2 ring-gray-100/50",
  doneExpense: "bg-gray-50 border-gray-200 text-gray-700",
  doneIncome: "bg-gray-50 border-gray-200 text-gray-700",
  error: "bg-orange-50 border-orange-200 text-gray-800",
  default: "bg-gray-50 border-gray-200 text-gray-700",
};

interface BubbleOtherProps {
  msg: BubbleMsg;
  /** Tên người gửi — hiển thị phía trên bubble */
  senderName?: string | null;
  showAmount?: boolean;
  showCategory?: boolean;
  showStatus?: boolean;
}

export function BubbleOther({
  msg,
  senderName,
  showAmount = true,
  showCategory = true,
  showStatus = true,
}: BubbleOtherProps) {
  return (
    <div className="flex flex-col gap-1">
      {senderName && (
        <span className="text-2xs font-semibold text-muted-foreground px-1 truncate">
          {senderName}
        </span>
      )}
      <BubbleShell
        align="left"
        status={msg.status}
        colorTokens={OTHER_COLOR_TOKENS}
        transType={msg.transType}
        // không có onClick — người khác không edit được
      >
        <BubbleContent
          msg={msg}
          secondaryLeft={null}
          showAmount={showAmount}
          showCategory={showCategory}
          showStatus={showStatus}
        />
      </BubbleShell>
    </div>
  );
}
