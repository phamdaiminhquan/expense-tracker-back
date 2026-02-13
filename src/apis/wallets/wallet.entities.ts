import { FundType, FundLastMessage } from "@/common/lib/types.lib";
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
