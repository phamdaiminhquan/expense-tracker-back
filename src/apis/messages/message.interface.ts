import { PageOptionsDto } from "@/common/interfaces/api.interface";
import { MessageStatus, FundType } from "@/common/lib/types.lib";
import { Message } from "./message.entities";
import { Wallet } from "../wallets/wallet.entities";

export type CategoryParentDto = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string | number;
};

export type CategoryDto = {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  fundId?: string | null;
  parent?: CategoryParentDto | null;
  createdAt?: string | number;
};

export type TransactionDto = {
  id: string;
  spendValue?: number | null;
  earnValue?: number | null;
  content?: string | null;
  categoryId?: string | null;
  category?: CategoryDto | null;
  walletId?: string | null;
  wallet?: Wallet | null;
  createdAt?: string | number;
  updatedAt?: string | number;
};

export type FundDto = {
  id: string;
  name: string;
  type: FundType;
  ownerId?: string | null;
  memberIds?: string[] | null;
  createdAt?: string | number;
};

export type MessageDto = {
  id: string;
  fundId: string;
  message: string;
  status: MessageStatus;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById?: string;
  deletedAt?: string | null;
  processedAt?: string | null;
  failureReason?: string | null;
  transactionId?: string | null;
  transaction?: TransactionDto | null;
};

export type CreateMessagePayload = {
  message: string | null;
  spendValue?: number | null;
  earnValue?: number | null;
  categoryId?: string | null;
};

export type UpdateMessagePayload = {
  message?: string | null;
};

export interface GetListMessagesDto extends PageOptionsDto<Message> {}

export interface CreateMessageDto {
  message: string | null;
  spendValue?: number | null;
  earnValue?: number | null;
  categoryId?: string | null;
  walletId?: string | null;
}

export interface UpdateMessageDto {
  message?: string | null;
  spendValue?: number | null;
  earnValue?: number | null;
  categoryId?: string | null;
  walletId?: string | null;
}
