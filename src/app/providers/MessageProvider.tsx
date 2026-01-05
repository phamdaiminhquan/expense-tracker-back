import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import {
  getListMessages,
  createMessage as apiCreateMessage,
  getMessage,
  updateMessage as apiUpdateMessage,
  deleteMessage as apiDeleteMessage,
} from "@/apis/messages/message.api";
import {
  CreateMessageDto,
  UpdateMessageDto,
} from "@/apis/messages/message.interface";
import { toast } from "sonner";

export const useMessage = (fundId: string, messageId?: string) => {
  const [loading, setLoading] = useState(false);

  const {
    data: messageList,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useSWR(
    fundId ? "messages" + JSON.stringify(fundId) : null,
    async () => await getListMessages(fundId),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );
  const {
    data: message,
    isLoading: isLoadingMessage,
    mutate: mutateMessage,
  } = useSWR(
    messageId ? `messages/${messageId}` : null,
    async () => await getMessage(messageId!),
    {
      revalidateOnFocus: false,
    }
  );

  // Create message
  const createMessage = useCallback(
    async (fundId: string, values: CreateMessageDto) => {
      setLoading(true);
      try {
        const newMessage = await apiCreateMessage(fundId, values);
        toast.success(
          newMessage.status === "pending"
            ? "Đã lưu ghi chú, sẽ xử lý sau"
            : "Đã thêm giao dịch!"
        );
        mutateList();
        mutate("wallets");
        return newMessage;
      } catch (error: any) {
        toast.error("Có lỗi xảy ra", {
          description: error?.message || "Vui lòng thử lại",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutateList]
  );

  // Update message
  const updateMessage = useCallback(
    async (id: string, values: UpdateMessageDto) => {
      setLoading(true);
      try {
        const updatedMessage = await apiUpdateMessage(id, values);
        toast.success("Cập nhật giao dịch thành công!");
        mutateList();
        mutateMessage();
        mutate("wallets");
        return updatedMessage;
      } catch (error) {
        toast.error("Cập nhật giao dịch thất bại", {
          description: error?.message || "Vui lòng thử lại",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutateList, mutateMessage]
  );

  // Delete message
  const deleteMessage = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await apiDeleteMessage(id);
        toast.success("Xóa giao dịch thành công!");
        mutateList();
        mutate("wallets");
        return true;
      } catch (error: any) {
        toast.error("Xóa giao dịch thất bại", {
          description: error?.message || "Vui lòng thử lại",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [mutateList]
  );

  return {
    messageList,
    message,

    isLoadingList,
    isLoadingMessage,
    loading,

    createMessage,
    updateMessage,
    deleteMessage,

    mutateList,
    mutateMessage,
  };
};
