import { FundType, FundLastMessage } from "@/lib/types.lib";
import { BaseEntity } from "../../common/interfaces/api.interface";

export interface Fund extends BaseEntity {
  id: string;
  name: string;
  type: FundType;
  ownerId: string;
  numberId: string;
  memberIds: string[];
  lastMessage?: FundLastMessage;
  isOpenDialogCate?: boolean;
  description: string | null;
  canAccess?: boolean;
  membershipRole?: "owner" | "member";
}
