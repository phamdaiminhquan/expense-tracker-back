import { useState, useRef, useEffect, useMemo } from "react";
import { Message, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import CapyInputBar from "@/components/CapyInputBar";
import { Search } from "lucide-react";
import { EditPendingPromptDialog } from "../../../../components/EditPendingPromptDialog";
import { EditMessageDialog } from "../../../../components/EditMessageDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Fund } from "@/apis/funds/fund.entities";
import { CATEGORIES_UI, OptimisticMessageStatus } from "../../message.constant";
import DashboardHeaderUI from "../../components/DashboardHeaderUI";
import MessageBubbleUI from "../../components/MessageBubbleUI";
import WalletSelectorModal from "../../components/WalletSelectorModal";
import useSWR from "swr";
import { getListWallets } from "@/apis/wallets/wallet.api";

interface ChatMessageViewProps {
  fund: Fund | null;
  funds: Fund[];
  messages: Message[];
  categories: Category[];
  currentUserId: string;
  currentUserName: string;
  resolveUserName: (userId: string) => string;
  onOpenDrawer: () => void;
  onShowStatistics: () => void;
  onManageCategories: () => void;
  onShowCategorySubscription: () => void;
  onAddMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;

  onResendMessage: (message: Message) => Promise<void>;
  onUpdateMessage: (message: Message) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  onSelectFund: (fundId: string) => void;
  isProcessing?: boolean;
  isLoading?: boolean;
  isLoadingFunds?: boolean;
}

const ITEMS_PER_PAGE = 10;

// ==========================================
// 3. OPTIMISTIC MESSAGE TYPE
// ==========================================

interface OptimisticMessage {
  id: string;
  text: string;
  status: OptimisticMessageStatus;
  createdAt: number;
  originalPrompt: string;
}

export function ChatMessageView({
  fund,
  funds,
  messages,
  categories,
  currentUserId,
  currentUserName,
  resolveUserName,
  onOpenDrawer,
  onShowStatistics,
  onManageCategories,
  onShowCategorySubscription,
  onAddMessage,

  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  onSelectFund,
  isProcessing = false,
  isLoading = false,
  isLoadingFunds = false,
}: ChatMessageViewProps) {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
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

  // ==========================================
  // OPTIMISTIC UI STATE - Hiện tin nhắn ngay lập tức
  // ==========================================
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([]);
  // Always fetch wallets so selectedWallet can default to first item on mount
  const { data, mutate } = useSWR(
    "wallets",
    async () => await getListWallets({ page: 1, take: 10 }),
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

  // Calculate stats
  const { totalExpense, totalIncome } = useMemo(() => {
    let expense = 0;
    let income = 0;
    // Lọc tin nhắn của ngày hôm nay
    const today = new Date().toDateString();
    messages.forEach((m) => {
      const msgDate = new Date(m.createdAt || m.timestamp).toDateString();
      if (msgDate === today && m.transaction) {
        expense += m.transaction.spendValue || 0;
        income += m.transaction.earnValue || 0;
      }
    });
    return { totalExpense: expense, totalIncome: income };
  }, [messages]);

  // ==========================================
  // OPTIMISTIC UI: Xóa optimistic message khi có message thật từ server
  // ==========================================
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

  // ==========================================
  // OPTIMISTIC SEND HANDLER - Core Logic
  // ==========================================
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
    };

    if (retryMessage) {
      // Nếu là retry, update status của message cũ
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.id === retryMessage.id ? optimisticMsg : m))
      );
    } else {
      // Nếu là tin mới, thêm vào list
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      setInput(""); // Clear input ngay lập tức
    }

    // 2. BACKGROUND API CALL
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
      });

      // 3. SUCCESS: Xóa optimistic message (server sẽ trả về message thật)
      // useEffect ở trên sẽ tự động xóa khi nhận được message từ server
    } catch (error) {
      // 4. NETWORK ERROR: Update status để hiện nút "Thử lại"
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
      className={`flex flex-col h-[100dvh] lg:h-full bg-white font-sans overflow-hidden relative`}
    >
      {/* 2. HEADER - Fixed at top */}
      <DashboardHeaderUI
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        isSmartMode={isSmartMode}
        onOpenSidebar={onOpenDrawer}
        onToggleSmart={() => setIsSmartMode(!isSmartMode)}
        fundName={fund?.name}
        onShowStatistics={onShowStatistics}
      />

      {/* 3. MESSAGE LIST - Scrollable with safe areas */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-6 scroll-smooth relative z-0 bg-[#FAFAFA] min-h-0"
      >
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex ${
                  i % 2 === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <Skeleton className="h-16 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : !fund ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[32px] bg-gray-50 mb-6 shadow-inner">
              <Search size={40} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">
              Chưa chọn quỹ
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Vui lòng chọn một quỹ từ menu bên trái để bắt đầu.
            </p>
            <Button
              onClick={onOpenDrawer}
              variant="outline"
              className="rounded-xl"
            >
              Mở danh sách quỹ
            </Button>
          </div>
        ) : (
          <>
            {/* REAL MESSAGES từ Server */}
            {[...visibleMessages].reverse().map((message) => {
              const isCurrentUser = message.createdById === currentUserId;

              // Xác định trạng thái message:
              // - 'network_error': clientStatus === 'failed' (lỗi mạng khi gửi)
              // - 'ai_error': AI không thể parse được transaction (transaction === null và đã xử lý xong)
              // - 'analyzing': isPendingPrompt === true và đang đợi AI xử lý
              // - 'done': đã có transaction thành công
              const getMessageStatus = () => {
                // 1. Lỗi mạng khi gửi
                if (message.clientStatus === "failed") return "network_error";

                // 2. Đang chờ AI xử lý
                if (message.isPendingPrompt) {
                  // Nếu có flag aiError từ backend
                  if (message.aiError) return "ai_error";
                  return "analyzing";
                }

                // 3. Đã xử lý xong nhưng KHÔNG có transaction → AI FAIL
                // (AI không thể extract được số tiền/loại giao dịch từ prompt)
                if (!message.transaction) {
                  return "ai_error";
                }

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
                wallet: fund?.name,
              };

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  <MessageBubbleUI
                    msg={uiMsg}
                    isCurrentUser={isCurrentUser}
                    walletName={fund?.name}
                    onRetry={() => {
                      // Lỗi mạng → gửi lại trực tiếp
                      onResendMessage(message);
                    }}
                    onEditPrompt={() => {
                      // AI không parse được → mở dialog chỉnh sửa prompt
                      setEditingPendingPrompt(message);
                    }}
                  />
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
                  <MessageBubbleUI
                    msg={uiMsg}
                    isCurrentUser={true}
                    walletName={fund?.name}
                    onRetry={() => handleOptimisticRetry(optMsg)}
                    onEditPrompt={() => handleOptimisticEditPrompt(optMsg)}
                  />
                </div>
              );
            })}
          </>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* 4. FOOTER & INPUT AREA - Fixed at bottom */}
      <div className="shrink-0 z-20 bg-white">
        {/* INTEGRATION ZONE: CapyInputBar với Optimistic UI */}
        <CapyInputBar
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
          onFocus={() => {}}
          onBlur={() => {}}
          onWalletClick={() => setShowWalletSelector(true)}
          onCategoryClick={() => setShowCategorySelector(true)}
        />
      </div>

      {/* 5. MODALS */}
      <WalletSelectorModal
        data={data}
        mutate={mutate}
        open={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        selectedWalletId={selectedWalletId}
        onSelect={(id) => {
          setSelectedWalletId(id);
          setShowWalletSelector(false);
        }}
      />

      {showCategorySelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowCategorySelector(false)}
          />
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative z-10 max-h-[70vh] flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">
              Danh mục
            </h3>
            <div className="grid grid-cols-4 gap-4 overflow-y-auto pb-8">
              {CATEGORIES_UI.expense.map((cat) => (
                <button
                  key={cat.id}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50"
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
        </div>
      )}

      <EditMessageDialog
        message={editingMessage}
        open={editingMessage !== null}
        onOpenChange={(open) => !open && setEditingMessage(null)}
        onSave={onUpdateMessage}
        onDelete={onDeleteMessage}
      />

      <EditPendingPromptDialog
        message={editingPendingPrompt}
        categories={categories}
        open={editingPendingPrompt !== null}
        onOpenChange={(open) => !open && setEditingPendingPrompt(null)}
        onSave={onUpdateMessage}
      />
    </div>
  );
}
