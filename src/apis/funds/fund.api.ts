import { axiosRequest } from "@/common/config/axios.config";
import {
  AddMemberPayload,
  FundMemberDto,
  GetListFundDto,
  CreateFundDto,
  UpdateFundDto,
  GetListFundMemberDto,
} from "./fund.interface";
import { ResList } from "@/common/interfaces/api.interface";
import { Fund } from "./fund.entities";

export const getListFunds = async (
  params: GetListFundDto
): Promise<ResList<Fund>> => {
  const res = await axiosRequest.get("funds", { params });
  return res.data;
};

export const createFund = async (body: CreateFundDto): Promise<Fund> => {
  const res = await axiosRequest.post("funds", body);
  return res.data;
};

export const getFund = async (id: string): Promise<Fund> => {
  const res = await axiosRequest.get(`funds/${id}`);
  return res.data;
};

export const getFundSearchNumberId = async (numberId: string): Promise<Fund> => {
  const res = await axiosRequest.get(`funds/search/${numberId}`);
  return res.data;
};

export const updateFund = async (
  id: string,
  body: UpdateFundDto
): Promise<Fund> => {
  const res = await axiosRequest.patch(`funds/${id}`, body);
  return res.data;
};

export const deleteFund = async (id: string): Promise<void> =>
  await axiosRequest.delete(`funds/${id}`);

export async function getFundMembers(
  fundId: string,
  params: GetListFundMemberDto
): Promise<FundMemberDto[]> {
  const res = await axiosRequest.get<FundMemberDto[]>(
    `/funds/${fundId}/members`,
    { params }
  );
  return res.data || [];
}

export async function addFundMember(
  fundId: string,
  payload: AddMemberPayload
): Promise<FundMemberDto> {
  const res = await axiosRequest.post<FundMemberDto>(
    `/funds/${fundId}/members`,
    payload
  );
  return res.data;
}

export async function removeFundMember(
  fundId: string,
  userId: string
): Promise<boolean> {
  await axiosRequest.delete(`/funds/${fundId}/members/${userId}`);
  return true;
}

export async function dialogCateOpened(fundId: string): Promise<boolean> {
  await axiosRequest.patch(`/funds/${fundId}/dialog-cate/close`, {
    isOpenDialogCate: false,
  });
  return true;
}
