import { axiosRequest } from "@/common/config";
import { ResList } from "@/common/interfaces/api.interface";
import { Wallet } from "./wallet.entities";
import {
  CreateWalletDto,
  GetListWalletDto,
  UpdateWalletDto,
  WalletTransactionsResponse,
} from "./wallet.interface";

export const getListWallets = async (
  params: GetListWalletDto
): Promise<ResList<Wallet>> => {
  const res = await axiosRequest.get("wallets", { params });
  return res.data;
};
export const createWallet = async (body: CreateWalletDto): Promise<Wallet> => {
  const res = await axiosRequest.post("wallets", body);
  return res.data;
};

export const getWallet = async (id: string): Promise<Wallet> => {
  const res = await axiosRequest.get(`wallets/${id}`);
  return res.data;
};

export const updateWallet = async (
  id: string,
  body: UpdateWalletDto
): Promise<Wallet> => {
  const res = await axiosRequest.patch(`wallets/${id}`, body);
  return res.data;
};

export const deleteWallet = async (id: string): Promise<void> =>
  await axiosRequest.delete(`wallets/${id}`);

export const getWalletTransactions = async (
  walletId: string
): Promise<WalletTransactionsResponse> => {
  const res = await axiosRequest.get(`wallets/${walletId}/transactions`);
  return res.data;
};
