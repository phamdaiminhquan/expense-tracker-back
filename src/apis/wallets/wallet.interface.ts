import { PageOptionsDto } from "@/common/interfaces/api.interface";
import { Wallet } from "./wallet.entities";
import { WalletType } from "./wallet.enum";

export interface GetListWalletDto extends PageOptionsDto<Wallet> {}

export interface CreateWalletDto {
  name: string;
  balance: number;
  type: WalletType;
  icon: string;
  color: string;
}

export interface UpdateWalletDto extends Partial<CreateWalletDto> {}

export interface WalletTransactionCategory {
  id: string;
  name: string;
}

export interface WalletTransactionWalletRef {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface WalletTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "INTERNAL" | "DEBT" | "REVERSAL";
  spendValue: number | null;
  earnValue: number | null;
  content: string;
  createdAt: string;
  category: WalletTransactionCategory | null;
  /** For INTERNAL transfers */
  fromWallet?: WalletTransactionWalletRef | null;
  toWallet?: WalletTransactionWalletRef | null;
  /** For DEBT */
  debtorName?: string | null;
  dueDate?: string | null;
  /** For REVERSAL */
  originalTransactionId?: string | null;
}

export interface WalletTransactionsResponse {
  wallet: Wallet & { isActive: boolean };
  data: WalletTransaction[];
  total: number;
}
