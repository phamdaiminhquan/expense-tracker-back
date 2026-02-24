import { useState, useRef, useEffect } from "react";
import { Message, Category } from "@/common/lib/types.lib";
import { DialogPromptEditPending } from "../../../../components/elements/dialog/dialog-prompt-edit-pending.element";
import { Fund } from "@/apis/funds/fund.entities";
import {
  CATEGORIES_UI,
} from "../../message.constant";
import MessageHeaderPart from "../message-header/message-header.part";
import useSWR, { mutate } from "swr";
import { getListWallets } from "@/apis/wallets/wallet.api";
import DialogWalletSelector from "@/components/elements/dialog/dialog-wallet-selector.element";
import React from "react";
import { getStatisticsByFundId } from "@/apis/statistics/statistic.api";
import { Range } from "@/apis/statistics/statistic.enum";
import { CreateMessageDto } from "@/apis/messages/message.interface";
import { useInfiniteChat } from "../../hooks/use-infinite-chat"; // NEW IMPORT
import { useOptimisticChat } from "../../hooks/use-optimistic-chat";
import { useScrollToBottom } from "../../hooks/use-scroll-to-bottom";
import { ChatList } from "./components/chat-list";
import { ChatInputArea } from "./components/chat-input-area";

interface ChatMessageViewProps {
  fund: Fund | null;
  // messages: Message[]; // REMOVE: No longer passed from parent, fetched internally
  // categories: Category[]; // Keep if passed from page
  // BUT Wait: Parent page might still pass 'messages' if it fetches initially. 
  // Ideally, we move fetching logic here. Let's assume parent still passes 'messages' but we IGNORE it in favor of useInfiniteChat for consistent pagination.
  // OR: modify Parent to NOT pass messages. For now, let's keep prop but ignore or alias.
  // Actually, keeping 'messages' prop might be confusing. Let's look at signature.
  // Let's keep signature compatible for now.
  messages: Message[];
  categories: Category[];
  currentUserId: string;
  currentUserName: string;
  onOpenDrawer: () => void;
  onCreateFund: () => void;
  onShowStatistics: () => void;
  onAddMessage: (message: CreateMessageDto) => Promise<void>;
  onOpenShareFundDialog: () => void;
  onResendMessage: (message: Message) => Promise<void>;
  onUpdateMessage: (message: Message) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  isProcessing?: boolean;
  isLoading?: boolean;
}

export function MessageChatPart({
  fund,
  messages: initialMessages, // Rename to avoid confusion, though we might not use it if we fetch fresh
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
  isLoading: isParentLoading = false,
  onOpenShareFundDialog,
}: ChatMessageViewProps) {
  // state
  const [editingPendingPrompt, setEditingPendingPrompt] =
    useState<Message | null>(null);
  const [input, setInput] = useState("");
  const [isSmartMode, setIsSmartMode] = useState(true);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("momo");

  // Data Fetching: Wallets & Stats
  const { data: dataWallet, mutate: mutateWallet } = useSWR(
    "wallets",
    async () => await getListWallets({ page: 1, take: 10 }),
    { revalidateOnFocus: false }
  );

  const { data: dataStatisticFundId, mutate: mutateStatisticFundId } = useSWR(
    fund?.id ? `statistics/funds/${fund.id}` : null,
    async () => await getStatisticsByFundId(fund?.id || null),
    { revalidateOnFocus: false }
  );

  // Default wallet logic
  useEffect(() => {
    if (!dataWallet?.data || dataWallet?.data.length === 0) return;
    const exists = dataWallet?.data.find((w) => w?.id === selectedWalletId);
    if (!exists) {
      setSelectedWalletId(dataWallet.data[0].id);
    }
  }, [dataWallet, selectedWalletId]);

  const selectedWallet =
    dataWallet?.data?.find((w) => w.id === selectedWalletId) || dataWallet?.data[0];

  // --- NEW INFINITE SCROLL HOOK ---
  const {
    messages: infiniteMessages,
    isLoadingInitial: isInfiniteLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    refresh: refreshMessages
  } = useInfiniteChat(fund?.id);

  // --- OPTIMISTIC UI HOOK ---
  const {
    optimisticMessages,
    handleOptimisticSend,
    handleOptimisticRetry,
    handleOptimisticEditPrompt,
  } = useOptimisticChat({
    fund,
    messages: infiniteMessages, // Use infinite messages
    onAddMessage,
    mutateStatisticFundId,
    refreshMessages // Notify infinite hook to re-fetch on send
  });

  // --- SCROLL HOOK ---
  const { scrollContainerRef, bottomRef, handleScroll } =
    useScrollToBottom({
      messages: infiniteMessages,
      optimisticMessages,
      loadMore,
      hasMore: !isReachingEnd,
      isLoadingMore
    });

  // Combine loading states
  const isLoading = isParentLoading || isInfiniteLoading;

  return (
    <div
      className={`flex flex-col h-dvh lg:h-full bg-white font-sans overflow-hidden relative`}
    >
      {/* HEADER */}
      <MessageHeaderPart
        totalExpense={dataStatisticFundId?.totalSpend || 0}
        totalIncome={dataStatisticFundId?.totalEarn || 0}
        isSmartMode={isSmartMode}
        onOpenSidebar={onOpenDrawer}
        onToggleSmart={() => setIsSmartMode(!isSmartMode)}
        fundName={fund?.name}
        fundId={fund?.id}
        onShowStatistics={onShowStatistics}
        onOpenShareFundDialog={onOpenShareFundDialog}
      />

      {/* MESSAGE LIST AREA */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4 space-y-2 scroll-smooth relative z-0 bg-gray-50 min-h-0"
      >
        {/* Loading Spinner for Load More */}
        {isLoadingMore && (
          <div className="flex justify-center p-2">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <ChatList
          isLoading={isLoading}
          fund={fund}
          visibleMessages={infiniteMessages} // Pass FULL flat list
          optimisticMessages={optimisticMessages}
          currentUserId={currentUserId}
          onCreateFund={onCreateFund}
          onResendMessage={(msg) =>
            onResendMessage({
              walletId: selectedWalletId,
              ...msg,
            })
          }
          setEditingPendingPrompt={setEditingPendingPrompt}
          handleOptimisticRetry={(msg) =>
            handleOptimisticRetry(msg, input, setInput, selectedWalletId)
          }
          handleOptimisticEditPrompt={(msg) =>
            handleOptimisticEditPrompt(msg, setInput)
          }
          wallets={dataWallet?.data || []}
        />
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* INPUT AREA */}
      <ChatInputArea
        input={input}
        setInput={setInput}
        selectedWallet={selectedWallet}
        isSmartMode={isSmartMode}
        isAnalyzing={
          isProcessing || optimisticMessages.some((m) => m.status === "analyzing")
        }
        onSend={() =>
          handleOptimisticSend(input, setInput, selectedWalletId)
        }
        onWalletClick={() => setShowWalletSelector(true)}
        onCategoryClick={() => setShowCategorySelector(true)}
      />

      {/* DIALOGS */}
      <DialogWalletSelector
        data={dataWallet}
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
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setShowCategorySelector(false)}
          />
          <div
            className="fixed bg-white z-50 shadow-2xl transform transition-all duration-300 ease-out
      bottom-0 left-0 right-0 rounded-t-2xl p-6
      sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:w-[480px] sm:max-w-[90vw]
      animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95
      max-h-[70vh] flex flex-col
    "
          >
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

      <DialogPromptEditPending
        message={editingPendingPrompt}
        categories={categories}
        wallets={dataWallet?.data || []}
        open={editingPendingPrompt !== null}
        onOpenChange={(open) => !open && setEditingPendingPrompt(null)}
        onSave={async (msg) => {
          await onUpdateMessage(msg);
          await mutateStatisticFundId();
          await Promise.all([
            mutate(["statistics", fund?.id, "expense", Range.MONTH]),
            mutate(["statistics", fund?.id, "income", Range.MONTH]),
          ]);
        }}
        onDelete={async (id) => {
          if (id) {
            await onDeleteMessage(id);
          }
          setEditingPendingPrompt(null);
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
