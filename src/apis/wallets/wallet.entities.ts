import { FundType, FundLastMessage } from "@/lib/types";
import { BaseEntity } from "../../common/interfaces/api.interface";
import { WalletType } from "./wallet.enum";

export interface Wallet extends BaseEntity {
  id: string;
  name: string;
  balance: number;
  type: WalletType;
  icon: string;
  color: string;
}
