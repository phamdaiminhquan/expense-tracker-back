import { axiosRequest } from "@/common/config/axios.config";
import { Message } from "@/lib/types.lib";
import { CreateMessageDto, UpdateMessageDto } from "./message.interface";
import { ResList } from "@/common/interfaces/api.interface";

export const getListMessages = async (
  fundId: string
): Promise<ResList<Message>> =>
  await axiosRequest.get(`funds/${fundId}/messages`);

export const createMessage = async (
  fundId: string,
  body: CreateMessageDto
): Promise<Message> => {
  const res = await axiosRequest.post(`funds/${fundId}/messages`, body);
  return res.data;
};

export const getMessage = async (id: string): Promise<Message> => {
  const res = await axiosRequest.get(`messages/${id}`);
  return res.data;
};

export const updateMessage = async (
  id: string,
  body: UpdateMessageDto
): Promise<Message> => {
  const res = await axiosRequest.patch(`messages/${id}`, body);
  return res.data;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await axiosRequest.delete(`messages/${id}`);
};
