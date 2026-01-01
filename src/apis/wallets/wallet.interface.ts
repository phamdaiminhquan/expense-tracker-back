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
