import { FundType, FundLastMessage, MessageStatus } from "@/common/lib/types.lib";
import { BaseEntity } from "../../common/interfaces/api.interface";
import { TransactionDto } from "./message.interface";
import { Fund } from "../funds/fund.entities";

export interface Message extends BaseEntity {
  id: string;
  fundId: string;
  message?: string | null;
  spendValue?: number | null;
  earnValue?: number | null;
  categoryId?: string | null;
  status?: MessageStatus;
  metadata?: Record<string, unknown> | null;
  transactionId?: string | null;
  createdByName?: string | null;
  fund?: Fund | null;
  transaction?: TransactionDto | null;
}
