import { BaseEntity, PageOptionsDto } from "@/common/interfaces/api.interface";
import { FundType } from "@/lib/types.lib";
import { Fund } from "./fund.entities";
import { JoinFundStatus } from "./fund.enum";

export type FundLastMessageDto = {
  id: string;
  message: string | null;
  createdAt: string; // ISO 8601
  processedAt: string | null; // ISO 8601
};

export type FundDto = {
  id: string;
  name: string;
  type: FundType;
  ownerId: string;
  numberId: string | null;
  description: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  memberIds?: string[];
  isOpenDialogCate?: boolean;
  lastMessage: FundLastMessageDto | null; // Message mới nhất từ BE (đã được sort)
};

export interface FundsListResponse {
  data: FundDto[];
  total: number;
}

export interface FundsListQuery {
  page?: number;
  take?: number;
  orderBy?: string;
  orderType?: "ASC" | "DESC";
  search?: string;
}

export type FundMemberDto = {
  id: string;
  fundId: string;
  userId: string;
  role: "owner" | "member";
  user?: {
    id: string;
    email: string;
    name: string;
  };
};

export interface GetListFundMemberDto extends PageOptionsDto<FundMemberDto> { }

export interface CreateFundPayload {
  name: string;
  type: FundType;
  memberIds?: string[];
}

export interface UpdateFundPayload {
  name?: string;
  type?: FundType;
  memberIds?: string[];
}

export interface AddMemberPayload {
  userId: string;
  role: "owner" | "member";
}

export interface CloseDialogCateDto {
  isOpenDialogCate: boolean;
}

export interface GetListFundDto extends PageOptionsDto<Fund> { }

export interface CreateFundDto {
  name: string;
  type: FundType;
  description?: string | null;
}

export interface UpdateFundDto {
  name?: string;
  type?: FundType;
  description?: string | null;
}

export interface UserJoinRequest extends BaseEntity {
  email: string;
  name: string;
}

export interface JoinFundRequest extends BaseEntity {
  fundId: string;
  userId: string;
  status: JoinFundStatus;
  tag?: string;
  userEmail?: string;
  reviewedById?: string;
  reviewedAt?: string;
  message?: string;
  user?: UserJoinRequest;
}
