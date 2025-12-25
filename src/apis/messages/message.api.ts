import { axiosRequest } from '@/common/config/axios.config'
import { Message } from '@/lib/types'
import { CreateMessageDto,  GetListMessagesDto, UpdateMessageDto } from './message.interface'
import { ResList } from '@/common/interfaces/api.interface'

export const getListMessages = async (fundId: string): Promise<ResList<Message>> => {
  const res = await axiosRequest.get(`funds/${fundId}/messages`)
  return res.data
}

export const createMessage = async (body: CreateMessageDto): Promise<Message> => {
  const res = await axiosRequest.post('messages', body)
  return res.data
}

export const getMessage = async (id: string): Promise<Message> => {
  const res = await axiosRequest.get(`messages/${id}`)
  return res.data
}

export const updateMessage = async (id: string, body: UpdateMessageDto): Promise<Message> => {
  const res = await axiosRequest.patch(`messages/${id}`, body)
  return res.data
}

export const deleteMessage = async (id: string): Promise<void> => {
  await axiosRequest.delete(`messages/${id}`)
}
