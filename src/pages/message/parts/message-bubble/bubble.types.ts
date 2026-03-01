// ─── Shared types cho tất cả các loại bubble chat ───────────────────────────

export type BubbleVariant = "user" | "other" | "ai";

export type BubbleStatus =
  | "analyzing"
  | "done"
  | "error"
  | "ai_error"
  | "network_error";

/** Shape chuẩn hoá của một message được truyền vào bất kỳ bubble nào */
export interface BubbleMsg {
  id: string;
  text: string;
  status: BubbleStatus;
  transType?: "expense" | "income";
  rawAmount?: number;
  category?: string;
  categoryIcon?: string;
}

/** Token màu sắc + border — mỗi variant tự khai báo, truyền vào BubbleShell */
export interface BubbleColorTokens {
  /** bg + border khi status = "analyzing" */
  analyzing: string;
  /** bg + border khi status = "done", expense */
  doneExpense: string;
  /** bg + border khi status = "done", income */
  doneIncome: string;
  /** bg + border khi status là bất kỳ error */
  error: string;
  /** bg + border khi không có status đặc biệt (default / plain text) */
  default: string;
}

/** Các slot hiển thị — variant tự quyết định default, parent có thể override */
export interface BubbleDisplaySlots {
  /** Slot trái của secondary row (wallet / sender name / empty) */
  secondaryLeft?: React.ReactNode;
  showAmount?: boolean;
  showCategory?: boolean;
  showStatus?: boolean;
}
