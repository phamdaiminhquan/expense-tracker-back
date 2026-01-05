import { useState, useRef, useEffect } from "react";
import { Message, Category } from "@/lib/types.lib";
import { Button } from "@/components/ui/button";
import InputBarCapy from "@/components/elements/input/input-bar-capy.element";
import { Search } from "lucide-react";
import { DialogPromptEditPending } from "../../../../components/elements/dialog/dialog-prompt-edit-pending.element";
import { DialogMessageEdit } from "../../../../components/elements/dialog/dialog-message-edit.element";
import { Skeleton } from "@/components/ui/skeleton";
import { Fund } from "@/apis/funds/fund.entities";
import {
  CATEGORIES_UI,
  ITEMS_PER_PAGE,
  OptimisticMessageStatus,
} from "../../message.constant";
import MessageHeaderPart from "../message-header/message-header.part";
import MessageBubblePart from "../message-bubble/message-bubble.part";
import useSWR, { mutate } from "swr";
import { getListWallets } from "@/apis/wallets/wallet.api";
import DialogWalletSelector from "@/components/elements/dialog/dialog-wallet-selector.element";
import { DialogMessageAction } from "@/components/elements/dialog/dialog-message-action.element";
import React from "react";
import { getStatisticsByFundId } from "@/apis/statistics/statistic.api";
import { Range } from "@/apis/statistics/statistic.enum";
interface ChatMessageViewProps {
  fund: Fund | null;
  messages: Message[];
  categories: Category[];
  currentUserId: string;
  currentUserName: string;
  onOpenDrawer: () => void;
  onCreateFund: () => void;
  onShowStatistics: () => void;
  onOpenShareFundDialog: () => void;
  onAddMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  onResendMessage: (message: Message) => Promise<void>;
  onUpdateMessage: (message: Message) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  isProcessing?: boolean;
  isLoading?: boolean;
}

interface OptimisticMessage {
  id: string;
  text: string;
  status: OptimisticMessageStatus;
  createdAt: number;
  originalPrompt: string;
  walletId?: string;
}

export function MessageChatPart({
  fund,
  messages,
  categories,
  currentUserId,
  currentUserName,
  onOpenDrawer,
  onCreateFund,
  onShowStatistics,
  onAddMessage,
  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  isProcessing = false,
  isLoading = false,
  onOpenShareFundDialog
}: ChatMessageViewProps) {
  // state
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editingPendingPrompt, setEditingPendingPrompt] =
    useState<Message | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isSmartMode, setIsSmartMode] = useState(true);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("momo");
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  // OPTIMISTIC UI STATE - Hiện tin nhắn ngay lập tức
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([]);

  // function
  const { data, mutate: mutateWallet } = useSWR(
    "wallets",
    async () => await getListWallets({ page: 1, take: 10 }),
    { revalidateOnFocus: false }
  );

  const { data: dataStatisticFundId, mutate: mutateStatisticFundId } = useSWR(
    fund?.id ? `statistics/funds/${fund.id}` : null,
    async () => await getStatisticsByFundId(fund?.id || null),
    { revalidateOnFocus: false }
  );
  useEffect(() => {
    if (!data?.data || data?.data.length === 0) return;
    const exists = data?.data.find((w) => w?.id === selectedWalletId);
    if (!exists) {
      setSelectedWalletId(data.data[0].id);
    }
  }, [data, selectedWalletId]);
  const selectedWallet =
    data?.data?.find((w) => w.id === selectedWalletId) || data?.data[0];

  const sortedMessages = [...messages].sort(
    (a, b) => b.timestamp - a.timestamp
  );
  const visibleMessages = sortedMessages.slice(0, visibleCount);

  // OPTIMISTIC UI: Xóa optimistic message khi có message thật từ server
  useEffect(() => {
    if (messages.length === 0) return;

    // Lọc bỏ optimistic messages đã được server xác nhận
    setOptimisticMessages((prev) => {
      const serverMessageTexts = new Set(
        messages.map((m) => m.message.trim().toLowerCase())
      );
      return prev.filter((opt) => {
        // Giữ lại nếu đang analyzing hoặc network_error
        if (opt.status === "network_error") return true;
        // Xóa nếu đã có message tương ứng từ server
        return !serverMessageTexts.has(opt.text.trim().toLowerCase());
      });
    });
  }, [messages]);

  // OPTIMISTIC SEND HANDLER - Core Logic
  const handleOptimisticSend = async (retryMessage?: OptimisticMessage) => {
    const textToSend = retryMessage?.text || input.trim();
    if (!textToSend || !fund) return;

    const tempId = retryMessage?.id || `optimistic-${Date.now()}`;

    // 1. OPTIMISTIC UPDATE: Hiển thị message ngay lập tức với status 'analyzing'
    const optimisticMsg: OptimisticMessage = {
      id: tempId,
      text: textToSend,
      status: "analyzing",
      createdAt: retryMessage?.createdAt || Date.now(),
      originalPrompt: textToSend,
      walletId: selectedWalletId,
    };

    if (retryMessage) {
      // Nếu là retry, update status của message cũ
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.id === retryMessage.id ? optimisticMsg : m))
      );
    } else {
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      setInput("");
    }

    try {
      await onAddMessage({
        createdById: currentUserId,
        userName: currentUserName,
        fundId: fund.id,
        spend: null,
        earn: null,
        message: textToSend,
        isPendingPrompt: true,
        originalPrompt: textToSend,
        createdAt: optimisticMsg.createdAt,
        walletId: selectedWalletId,
      });
      mutateWallet();
      mutateStatisticFundId();
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
  const handleOptimisticRetry = (msg: OptimisticMessage) => {
    handleOptimisticSend(msg);
  };

  // Edit prompt handler cho optimistic messages
  const handleOptimisticEditPrompt = (msg: OptimisticMessage) => {
    // Xóa optimistic message và mở dialog edit
    setOptimisticMessages((prev) => prev.filter((m) => m.id !== msg.id));
    // Đặt lại input để user có thể sửa
    setInput(msg.text);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && visibleCount < sortedMessages.length) {
      const oldScrollHeight = container.scrollHeight;
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, sortedMessages.length)
      );

      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - oldScrollHeight;
      }, 0);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, optimisticMessages.length]);

  return (
    <div
      className={`flex flex-col h-dvh lg:h-full bg-white font-sans overflow-hidden relative`}
    >
      {/* 2. HEADER - Fixed at top */}
      <MessageHeaderPart
        totalExpense={dataStatisticFundId?.totalSpend || 0}
        totalIncome={dataStatisticFundId?.totalEarn || 0}
        isSmartMode={isSmartMode}
        onOpenSidebar={onOpenDrawer}
        onToggleSmart={() => setIsSmartMode(!isSmartMode)}
        fundName={fund?.name}
        onShowStatistics={onShowStatistics}
        onOpenShareFundDialog={onOpenShareFundDialog}
      />

      {/* 3. MESSAGE LIST - Scrollable with safe areas */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-2 scroll-smooth relative z-0 bg-gray-50 min-h-0"
      >
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"
                  }`}
              >
                <Skeleton className="h-16 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : !fund ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-gray-50 mb-6 shadow-inner">
              <Search size={40} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">
              Chưa chọn quỹ
            </p>
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
          </div>
        ) : (
          <>
            {/* REAL MESSAGES từ Server */}
            {[...visibleMessages].reverse().map((message) => {
              const isCurrentUser = message.createdById === currentUserId;
              
              const getMessageStatus = () => {
                // 1. Lỗi mạng khi gửi
                if (message.clientStatus === "failed") return "network_error";

                // 2. Đang chờ AI xử lý
                if (message.isPendingPrompt) {
                  if (message.aiError) return "ai_error";
                  return "analyzing";
                }

                // 3. Đã xử lý xong nhưng KHÔNG có transaction → AI FAIL
                if (!message.transaction) return "ai_error";

                // 4. Có transaction → thành công
                return "done";
              };

              const uiMsg = {
                id: message.id,
                text: message.message,
                rawAmount:
                  message.transaction?.spendValue ||
                  message.transaction?.earnValue ||
                  0,
                status: getMessageStatus(),
                transType:
                  (message.transaction?.spendValue || 0) > 0
                    ? "expense"
                    : "income",
                category:
                  message.transaction?.category?.name || "Chưa phân loại",
                categoryIcon: message.transaction?.category?.icon,
                wallet: fund?.name,
              };

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isCurrentUser ? "justify-end" : "justify-start"
                    } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  {(() => {
                    const wallet =
                      message.transaction?.wallet ||
                      data?.data?.find((w) => w.id === message.walletId);
                    return (
                      <MessageBubblePart
                        msg={uiMsg}
                        isCurrentUser={isCurrentUser}
                        walletName={wallet?.name || fund?.name}
                        walletColor={wallet?.color}
                        walletIcon={wallet?.icon}
                        onRetry={() => {
                          // Lỗi mạng → gửi lại trực tiếp
                          onResendMessage(message);
                        }}
                        onEditPrompt={() => {
                          // AI không parse được → mở dialog chỉnh sửa prompt
                          setEditingPendingPrompt(message);
                        }}
                        onOpenEditDialog={() => {
                          setSelectedMessage(message);
                          setActionSheetOpen(true);
                        }}
                      />
                    );
                  })()}
                </div>
              );
            })}

            {/* OPTIMISTIC MESSAGES - Hiển thị ngay khi gửi */}
            {optimisticMessages.map((optMsg) => {
              const uiMsg = {
                id: optMsg.id,
                text: optMsg.text,
                rawAmount: 0,
                status: optMsg.status,
                transType: "expense" as const,
                category: "",
                wallet: fund?.name,
              };

              return (
                <div
                  key={optMsg.id}
                  className="flex w-full justify-end animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  {(() => {
                    const wallet = data?.data?.find(
                      (w) => w.id === optMsg.walletId
                    );
                    return (
                      <MessageBubblePart
                        msg={uiMsg}
                        isCurrentUser={true}
                        walletName={wallet?.name || fund?.name}
                        walletColor={wallet?.color}
                        walletIcon={wallet?.icon}
                        onRetry={() => handleOptimisticRetry(optMsg)}
                        onEditPrompt={() => handleOptimisticEditPrompt(optMsg)}
                      />
                    );
                  })()}
                </div>
              );
            })}
          </>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* FOOTER & INPUT_BAR */}
      <div className="shrink-0 z-20 bg-white">
        <InputBarCapy
          inputValue={input}
          setInputValue={setInput}
          selectedWallet={selectedWallet}
          isSmartMode={isSmartMode}
          isAnalyzing={
            isProcessing ||
            optimisticMessages.some((m) => m.status === "analyzing")
          }
          capyMood={
            isProcessing ||
              optimisticMessages.some((m) => m.status === "analyzing")
              ? "excited"
              : "sleepy"
          }
          onSend={() => handleOptimisticSend()}
          onFocus={() => { }}
          onBlur={() => { }}
          onWalletClick={() => setShowWalletSelector(true)}
          onCategoryClick={() => setShowCategorySelector(true)}
        />
      </div>

      <DialogWalletSelector
        data={data}
        mutate={mutateWallet}
        open={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        selectedWalletId={selectedWalletId}
        onSelect={(id) => {
          setSelectedWalletId(id);
          setShowWalletSelector(false);
        }}
      />
      {showCategorySelector && (
        <React.Fragment>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setShowCategorySelector(false)}
          />

          {/* Modal Panel - Bottom sheet on mobile, centered on sm+ */}
          <div
            className="fixed bg-white z-50 shadow-2xl transform transition-all duration-300 ease-out
      bottom-0 left-0 right-0 rounded-t-2xl p-6
      sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:w-[480px] sm:max-w-[90vw]
      animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95
      max-h-[70vh] flex flex-col
    "
          >
            {/* Handle bar - chỉ hiện trên mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">
              Danh mục
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto pb-8">
              {CATEGORIES_UI.expense.map((cat) => (
                <button
                  key={cat.id}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center text-xl">
                    {cat.icon}
                  </div>
                  <div className="text-xs text-center font-medium text-gray-600 line-clamp-1">
                    {cat.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}

      <DialogMessageAction
        isOpen={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        onEdit={() => setEditingMessage(selectedMessage)}
        onDelete={() => {
          (async () => {
            await onDeleteMessage(selectedMessage?.id || "");
            setActionSheetOpen(false);
            // revalidate fund-level statistics and per-tab statistic keys
            await mutateStatisticFundId();
            await Promise.all([
              mutate(["statistics", fund?.id, "expense", Range.MONTH]),
              mutate(["statistics", fund?.id, "income", Range.MONTH]),
            ]);
          })();
        }}
        message={selectedMessage}
      />

      <DialogMessageEdit
        message={editingMessage}
        open={editingMessage !== null}
        onOpenChange={(open) => !open && setEditingMessage(null)}
        onSave={async (msg) => {
          await onUpdateMessage(msg);
          setActionSheetOpen(false);
          await mutateStatisticFundId();
          await Promise.all([
            mutate(["statistics", fund?.id, "expense", Range.MONTH]),
            mutate(["statistics", fund?.id, "income", Range.MONTH]),
          ]);
        }}
        onDelete={async (msg) => {
          await onDeleteMessage(msg);
          setActionSheetOpen(false);
          await mutateStatisticFundId();
          await Promise.all([
            mutate(["statistics", fund?.id, "expense", Range.MONTH]),
            mutate(["statistics", fund?.id, "income", Range.MONTH]),
          ]);
        }}
      />

      <DialogPromptEditPending
        message={editingPendingPrompt}
        categories={categories}
        open={editingPendingPrompt !== null}
        onOpenChange={(open) => !open && setEditingPendingPrompt(null)}
        onSave={async (msg) => {
          await onUpdateMessage(msg);
          setActionSheetOpen(false);
          await mutateStatisticFundId();
          await Promise.all([
            mutate(["statistics", fund?.id, "expense", Range.MONTH]),
            mutate(["statistics", fund?.id, "income", Range.MONTH]),
          ]);
        }}
      />

    </div>
  );
}
