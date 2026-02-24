import { useEffect, useState } from "react";
import { Message } from "@/common/lib/types.lib";
import { Fund } from "@/apis/funds/fund.entities";
import MessageBubblePart from "../../message-bubble/message-bubble.part";
import { OptimisticMessage } from "../../../hooks/use-optimistic-chat";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ChatListProps {
    isLoading: boolean;
    fund: Fund | null;
    visibleMessages: Message[];
    optimisticMessages: OptimisticMessage[];
    currentUserId: string;
    onCreateFund: () => void;
    onResendMessage: (msg: any) => void;
    setEditingPendingPrompt: (msg: Message) => void;
    handleOptimisticRetry: (msg: OptimisticMessage) => void;
    handleOptimisticEditPrompt: (msg: OptimisticMessage) => void;
    wallets: any[];
}

const OPTIMISTIC_STAGE_TIMING = {
    showSpinnerMs: 200,
    showWalletMs: 600,
    showAmountMs: 1000,
};

// --- Animation variants ---
const messageVariants = {
    hidden: (isCurrentUser: boolean) => ({
        opacity: 0,
        x: isCurrentUser ? 20 : -20,
        y: 8,
    }),
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            mass: 0.8,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 },
    },
};

const skeletonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.4,
            ease: "easeOut" as const,
        },
    }),
};

function OptimisticMessageBubble({
    optMsg,
    fund,
    wallets,
    onRetry,
    onEditPrompt,
}: {
    optMsg: OptimisticMessage;
    fund: Fund | null;
    wallets: any[];
    onRetry: () => void;
    onEditPrompt: () => void;
}) {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        if (optMsg.status !== "analyzing") {
            setStage(3);
            return;
        }

        setStage(0);
        const t1 = setTimeout(() => setStage(1), OPTIMISTIC_STAGE_TIMING.showSpinnerMs);
        const t2 = setTimeout(() => setStage(2), OPTIMISTIC_STAGE_TIMING.showWalletMs);
        const t3 = setTimeout(() => setStage(3), OPTIMISTIC_STAGE_TIMING.showAmountMs);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [optMsg.id, optMsg.status]);

    // Heuristic for optimistic transaction type
    const isIncome = /(lương|thưởng|thu|nạp|biếu|tặng|được|bán)/i.test(optMsg.text);
    const transType = isIncome ? "income" : "expense";

    const uiMsg = {
        id: optMsg.id,
        text: optMsg.text,
        sender: "user",
        status: optMsg.status,
        timestamp: new Date(optMsg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        rawAmount: optMsg.detectedMoney || 0,
        transType: transType,
        category: "Đang phân tích...",
        categoryIcon: "loader",
    };

    if (optMsg.resolvedMessage) {
        const spendVal = parseFloat(
            optMsg.resolvedMessage.transaction?.spendValue as any || "0"
        );
        const earnVal = parseFloat(
            optMsg.resolvedMessage.transaction?.earnValue as any || "0"
        );

        uiMsg.text = optMsg.resolvedMessage.message;
        uiMsg.status =
            optMsg.resolvedMessage.status === "failed" ? "ai_error" : "done";
        uiMsg.rawAmount = spendVal > 0 ? spendVal : earnVal;
        uiMsg.transType = spendVal > 0 ? "expense" : "income";
        uiMsg.category =
            optMsg.resolvedMessage.transaction?.category?.name || "Chưa phân loại";
        uiMsg.categoryIcon = optMsg.resolvedMessage.transaction?.category?.icon ?? "loader";
    }

    const resolvedWalletId = optMsg.resolvedMessage?.transaction?.wallet?.id;
    const wallet = wallets?.find(
        (w) => w.id === (resolvedWalletId || optMsg.walletId)
    );

    const showHeader = true;
    const showWallet = stage >= 2 || optMsg.status !== "analyzing";
    const showAmount = stage >= 3 || optMsg.status !== "analyzing";
    const showCategory = !!optMsg.resolvedMessage;

    return (
        <motion.div
            custom={true}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-full min-w-0 justify-end"
        >
            <MessageBubblePart
                msg={uiMsg as any}
                isCurrentUser={true}
                walletName={wallet?.name || fund?.name}
                walletColor={wallet?.color}
                walletIcon={wallet?.icon}
                onRetry={onRetry}
                onEditPrompt={onEditPrompt}
                display={{
                    showHeader,
                    showWallet,
                    showStatus: true,
                    showAmount,
                    showCategory,
                }}
            />
        </motion.div>
    );
}

export function ChatList({
    isLoading,
    fund,
    visibleMessages,
    optimisticMessages,
    currentUserId,
    onCreateFund,
    onResendMessage,
    setEditingPendingPrompt,
    handleOptimisticRetry,
    handleOptimisticEditPrompt,
    wallets,
}: ChatListProps) {
    if (isLoading) {
        return (
            <div className="space-y-5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={skeletonVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                    >
                        <Skeleton
                            className="rounded-2xl"
                            style={{
                                height: `${40 + Math.random() * 32}px`,
                                width: `${140 + (i % 3) * 40}px`,
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        );
    }

    if (!fund) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-24"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-gray-50 mb-6 shadow-inner">
                    <Search size={40} className="text-gray-300" />
                </div>
                <p className="text-base font-bold text-gray-800 mb-2">Chưa chọn quỹ</p>
                <p className="text-sm text-gray-400 mb-6">
                    Vui lòng chọn một quỹ hoặc tạo quỹ mới để bắt đầu.
                </p>
                <Button
                    onClick={onCreateFund}
                    variant="default"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100"
                >
                    Tạo quỹ mới ngay
                </Button>
            </motion.div>
        );
    }

    const resolvedServerIds = new Set(
        optimisticMessages
            .map((m) => m.serverMessageId)
            .filter((id): id is string => Boolean(id))
    );

    const filteredMessages = visibleMessages.filter(
        (m) => !resolvedServerIds.has(m.id)
    );

    return (
        <AnimatePresence initial={false}>
            {/* REAL MESSAGES từ Server */}
            {[...filteredMessages].reverse().map((message) => {
                const isCurrentUser = message.createdById === currentUserId;

                const getMessageStatus = () => {
                    if (message.clientStatus === "failed") return "network_error";

                    // Prioritize confirmed status from Server
                    if (message.status === "processed" || message.transaction) return "done";
                    if (message.status === "failed") return "ai_error";

                    if (message.isPendingPrompt) {
                        if (message.aiError) return "ai_error";
                        return "analyzing";
                    }

                    // Fallback
                    if (!message.transaction) return "analyzing";
                    return "done";
                };

                const spendVal = parseFloat(message.transaction?.spendValue as any || '0');
                const earnVal = parseFloat(message.transaction?.earnValue as any || '0');

                const uiMsg = {
                    id: message.id,
                    text: message.message,
                    rawAmount: spendVal > 0 ? spendVal : earnVal,
                    status: getMessageStatus(),
                    transType: spendVal > 0 ? "expense" : "income",
                    category: message.transaction?.category?.name || "Chưa phân loại",
                    categoryIcon: message.transaction?.category?.icon,
                    walletName: message.transaction?.wallet?.name || fund?.name,
                    walletColor: message.transaction?.wallet?.color,
                    walletIcon: message.transaction?.wallet?.icon,
                };

                return (
                    <motion.div
                        key={message.id}
                        custom={isCurrentUser}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ pointerEvents: 'auto' }}
                        className={`flex w-full min-w-0 cursor-pointer ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                        <MessageBubblePart
                            msg={uiMsg as any}
                            isCurrentUser={isCurrentUser}
                            walletName={uiMsg.walletName}
                            walletColor={uiMsg.walletColor}
                            walletIcon={uiMsg.walletIcon}
                            onRetry={() =>
                                onResendMessage({
                                    ...message,
                                })
                            }
                            onEditPrompt={() => {
                                setEditingPendingPrompt(message);
                            }}
                            onOpenEditDialog={() => {
                                console.log('[DEBUG] onOpenEditDialog clicked for message:', message.id);
                                setEditingPendingPrompt(message);
                            }}
                        />
                    </motion.div>
                );
            })}

            {/* OPTIMISTIC MESSAGES */}
            {optimisticMessages.map((optMsg) => {
                return (
                    <OptimisticMessageBubble
                        key={optMsg.id}
                        optMsg={optMsg}
                        fund={fund}
                        wallets={wallets}
                        onRetry={() => handleOptimisticRetry(optMsg)}
                        onEditPrompt={() => handleOptimisticEditPrompt(optMsg)}
                    />
                );
            })}
        </AnimatePresence>
    );
}
