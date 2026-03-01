/**
 * MessageBubblePart  (Orchestrator)
 * ────────────────────────────────────────────────────────────────────────────
 * Điểm vào duy nhất cho ChatList — nhận message data + context, chọn đúng
 * variant (BubbleUser / BubbleOther / BubbleAI) và render.
 *
 * KHÔNG chứa style nào. KHÔNG chứa logic render trực tiếp.
 * Để thêm loại bubble mới: tạo file variant mới + thêm case ở đây.
 */

import React from "react";
import { BubbleUser } from "./bubble-user";
import { BubbleOther } from "./bubble-other";
import { BubbleMsg } from "./bubble.types";

interface Props {
  msg: BubbleMsg & Record<string, any>; // cho phép extra fields từ legacy code
  isCurrentUser: boolean;
  senderName?: string | null;
  walletName?: string;
  walletColor?: string;
  walletIcon?: string;
  onRetry?: (msg: any) => void;
  onEditPrompt?: (msg: any) => void;
  onOpenEditDialog?: (msg: any) => void;
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
  isCurrentUser,
  senderName,
  walletName,
  walletColor,
  walletIcon,
  onOpenEditDialog,
  display,
}) => {
  const bubbleMsg: BubbleMsg = {
    id: msg.id,
    text: msg.text,
    status: msg.status,
    transType: msg.transType,
    rawAmount: msg.rawAmount,
    category: msg.category,
    categoryIcon: msg.categoryIcon,
  };

  if (isCurrentUser) {
    return (
      <BubbleUser
        msg={bubbleMsg}
        walletName={walletName}
        walletColor={walletColor}
        walletIcon={walletIcon}
        onOpenEditDialog={onOpenEditDialog}
        showWallet={display?.showWallet !== false}
        showAmount={display?.showAmount !== false}
        showCategory={display?.showCategory !== false}
        showStatus={display?.showStatus !== false}
      />
    );
  }

  return (
    <BubbleOther
      msg={bubbleMsg}
      senderName={senderName}
      showAmount={display?.showAmount !== false}
      showCategory={display?.showCategory !== false}
      showStatus={display?.showStatus !== false}
    />
  );
};

export default MessageBubblePart;
