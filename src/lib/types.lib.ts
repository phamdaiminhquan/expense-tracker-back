import { TransactionDto } from "@/apis/messages/message.interface";

export type FundType = "personal" | "shared";

export type MessageStatus = "pending" | "processed" | "failed";

export interface Category {
  id: string
  fundId: string
  name: string
  icon?: string
  description: string
  createdAt: number
}

export interface FundLastMessage {
  id: string;
  text: string;
  timestamp: number;
  processedAt?: number | null;
}

export interface Fund {
  id: string;
  name: string;
  type: FundType;
  ownerId: string;
  memberIds: string[];
  createdAt: number;
  lastMessage?: FundLastMessage; // Message mới nhất từ BE
  isOpenDialogCate?: boolean;
}

export interface Message {
  id: string;
  createdById: string;
  userName: string;
  fundId: string;
  spend: number | null;
  earn: number | null;
  message: string;
  categoryId?: string | null;
  categoryName?: string | null;
  timestamp: number;
  walletId?: string | null;
  status?: MessageStatus;
  isPendingPrompt?: boolean;
  originalPrompt?: string;
  createdAt: number;
  clientStatus?: "sending" | "sent" | "failed";
  clientTempId?: string;
  transaction?: TransactionDto;
  aiError?: boolean; // true khi AI không thể parse được transaction từ prompt
  promptCreatedAt?: number; // thời điểm tạo ghi chú ban đầu
}

export interface ParsedExpense {
  spend: number | null;
  earn: number | null;
  message: string;
  categoryId?: string | null;
}

export interface GeminiResponse {
  candidates?: Array<{
    message?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}
