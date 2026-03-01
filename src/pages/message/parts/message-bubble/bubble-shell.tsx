/**
 * BubbleShell
 * ────────────────────────────────────────────────────────────────────────────
 * Dumb wrapper — chịu trách nhiệm DUY NHẤT về:
 *   • Layout: border-radius theo align (trái/phải)
 *   • Background + border theo status (màu được inject qua colorTokens)
 *   • Click handler
 *   • Render children (inner content)
 *
 * KHÔNG chứa bất kỳ business logic nào.
 * KHÔNG biết đây là bubble của ai.
 */

import React from "react";
import { BubbleColorTokens, BubbleStatus } from "./bubble.types";

interface BubbleShellProps {
  align: "left" | "right";
  status: BubbleStatus;
  colorTokens: BubbleColorTokens;
  transType?: "expense" | "income";
  onClick?: () => void;
  children: React.ReactNode;
}

export function BubbleShell({
  align,
  status,
  colorTokens,
  transType,
  onClick,
  children,
}: BubbleShellProps) {
  const isError =
    status === "error" || status === "ai_error" || status === "network_error";
  const isAnalyzing = status === "analyzing";
  const isDone = status === "done";

  const radiusClass = align === "right" ? "rounded-tr-sm" : "rounded-tl-sm";

  const colorClass = isAnalyzing
    ? colorTokens.analyzing
    : isError
    ? colorTokens.error
    : isDone
    ? transType === "expense"
      ? colorTokens.doneExpense
      : colorTokens.doneIncome
    : colorTokens.default;

  return (
    <div
      onClick={onClick}
      className={`
        relative max-w-[85%] min-w-[200px] overflow-x-hidden
        px-4 py-3 rounded-2xl ${radiusClass}
        text-sm shadow-sm border group
        transition-all duration-500
        ${colorClass}
        ${isError ? "cursor-pointer" : ""}
      `}
    >
      {children}
    </div>
  );
}
