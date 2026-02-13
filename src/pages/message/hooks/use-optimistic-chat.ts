import { useState, useEffect } from "react";
import { Message } from "@/common/lib/types.lib";
import { CreateMessageDto } from "@/apis/messages/message.interface";
import { mutate } from "swr";
import { OptimisticMessageStatus } from "../message.constant";
import { parseMoney } from "./use-client-money-parser";

export interface OptimisticMessage {
    id: string;
    text: string;
    status: OptimisticMessageStatus;
    createdAt: number;
    originalPrompt: string;
    walletId?: string;
    detectedMoney?: number; // New field for optimistic money parsing
    serverMessageId?: string;
    resolvedMessage?: Message;
}

interface UseOptimisticChatProps {
    fund: any; // Type as Fund or any if imported
    messages: Message[];
    onAddMessage: (message: CreateMessageDto) => Promise<void>;
    mutateStatisticFundId: () => Promise<any>;
    refreshMessages?: () => void;
}

export function useOptimisticChat({
    fund,
    messages,
    onAddMessage,
    mutateStatisticFundId,
    refreshMessages,
}: UseOptimisticChatProps) {
    const [optimisticMessages, setOptimisticMessages] = useState<
        OptimisticMessage[]
    >([]);

    // Helper: Normalize text for comparison
    const normalizeText = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');

    // OPTIMISTIC UI: Xóa optimistic message khi có message thật từ server
    useEffect(() => {
        if (messages.length === 0) return;

        // Lọc bỏ optimistic messages đã được server xác nhận
        setOptimisticMessages((prev) => {
            const next = prev.map((opt) => {
                if (opt.status === "network_error") return opt;

                const matched = messages.find(
                    (m) => normalizeText(m.message) === normalizeText(opt.text)
                );
                if (!matched) return opt;

                // Already resolved - skip to avoid creating new object
                if (opt.serverMessageId === matched.id) return opt;

                const resolvedStatus: OptimisticMessageStatus =
                    matched.status === "failed" ? "ai_error" : "done";

                return {
                    ...opt,
                    status: resolvedStatus,
                    serverMessageId: matched.id,
                    resolvedMessage: matched,
                };
            });

            // Only update if something actually changed
            const changed = next.some((item, i) => item !== prev[i]);
            return changed ? next : prev;
        });
    }, [messages]);

    // OPTIMISTIC SEND HANDLER - Core Logic
    const handleOptimisticSend = async (
        textInput?: string,
        setInput?: (val: string) => void,
        selectedWalletId?: string,
        retryMessage?: OptimisticMessage
    ) => {
        const textToSend = retryMessage?.text || textInput?.trim();
        if (!textToSend || !fund) return;

        const tempId = retryMessage?.id || `optimistic-${Date.now()}`;

        // 1. OPTIMISTIC UPDATE: Hiển thị message ngay lập tức với status 'analyzing'
        // TÍNH TOÁN TIỀN NGAY TẠI CLIENT
        const detectedAmount = parseMoney(textToSend);

        const optimisticMsg: OptimisticMessage = {
            id: tempId,
            text: textToSend,
            status: "analyzing", // Start with analyzing
            createdAt: retryMessage?.createdAt || Date.now(),
            originalPrompt: textToSend,
            walletId: selectedWalletId,
            detectedMoney: detectedAmount > 0 ? detectedAmount : undefined,
        };

        if (retryMessage) {
            // Nếu là retry, update status của message cũ
            setOptimisticMessages((prev) =>
                prev.map((m) => (m.id === retryMessage.id ? optimisticMsg : m))
            );
        } else {
            setOptimisticMessages((prev) => [...prev, optimisticMsg]);
            if (setInput) setInput("");
        }

        try {
            await onAddMessage({
                fundId: fund.id,
                message: textToSend,
                walletId: selectedWalletId ?? null,
            } as CreateMessageDto);

            // 2. MARK AS DONE: Ngay khi gửi thành công, chuyển trạng thái sang DONE
            // Để hiển thị bubble xanh/đỏ ngay lập tức thay vì chờ SWR
            setOptimisticMessages((prev) =>
                prev.map((m) =>
                    m.id === tempId
                        ? { ...m, status: "done" as OptimisticMessageStatus }
                        : m
                )
            );

            mutateStatisticFundId();
            if (refreshMessages) {
                refreshMessages();
            }
            mutate(
                (key) =>
                    Array.isArray(key) && key[0] === "statistics" && key[1] === fund.id
            );
        } catch (error) {
            setOptimisticMessages((prev) =>
                prev.map((m) =>
                    m.id === tempId
                        ? { ...m, status: "network_error" as OptimisticMessageStatus }
                        : m
                )
            );
        }
    };

    // Retry handler cho optimistic messages bị lỗi mạng
    const handleOptimisticRetry = (
        msg: OptimisticMessage,
        input: string,
        setInput: (val: string) => void,
        selectedWalletId: string
    ) => {
        handleOptimisticSend(undefined, setInput, selectedWalletId, msg);
    };

    // Edit prompt handler cho optimistic messages
    const handleOptimisticEditPrompt = (
        msg: OptimisticMessage,
        setInput: (val: string) => void
    ) => {
        // Xóa optimistic message và mở dialog edit
        setOptimisticMessages((prev) => prev.filter((m) => m.id !== msg.id));
        // Đặt lại input để user có thể sửa
        setInput(msg.text);
    };

    return {
        optimisticMessages,
        handleOptimisticSend,
        handleOptimisticRetry,
        handleOptimisticEditPrompt,
    };
}
