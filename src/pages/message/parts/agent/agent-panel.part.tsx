import { useMemo, useState } from "react";
import { Bot, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fund } from "@/apis/funds/fund.entities";
import { Wallet } from "@/apis/wallets/wallet.entities";
import MessageBubblePart from "../message-bubble/message-bubble.part";
import { ChatInputArea } from "../message-chat/components/chat-input-area";
import DialogWalletSelector from "@/components/elements/dialog/dialog-wallet-selector.element";

type AgentRole = "user" | "agent";

interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
}

interface AgentPanelProps {
  fund: Fund | null;
  wallets: Wallet[];
  selectedWallet?: Wallet | null;
  onSelectWallet: (walletId: string) => void;
  onBackToChat: () => void;
}

export function AgentPanel({
  fund,
  wallets,
  selectedWallet,
  onSelectWallet,
  onBackToChat,
}: AgentPanelProps) {
  const [input, setInput] = useState("");
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "welcome-agent",
      role: "agent",
      content:
        "Mình là Agent FinCap. Bạn cứ nhập tự nhiên, mình sẽ tự tìm quỹ và ví phù hợp để xử lý.",
    },
  ]);

  const contextLabel = useMemo(() => {
    const fundName = fund?.name || "Chưa chọn quỹ";
    const walletName = selectedWallet?.name || "Chưa chọn ví";
    return `Context: ${fundName} • ${walletName}`;
  }, [fund?.name, selectedWallet?.name]);

  const handleSend = () => {
    const prompt = input.trim();
    if (!prompt) return;

    const userMessage: AgentMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: prompt,
    };

    const mockAgentMessage: AgentMessage = {
      id: `a-${Date.now()}`,
      role: "agent",
      content: `Đã nhận: "${prompt}". (Mock) Mình sẽ ưu tiên xử lý trên ví nguồn "${selectedWalletForInput.name}" trong quỹ "${fund?.name || "mặc định"}", kể cả khi bạn không nhắc tên ví trong câu lệnh.`,
    };

    setMessages((prev) => [...prev, userMessage, mockAgentMessage]);
    setInput("");
  };

  const selectedWalletForInput = selectedWallet || {
    name: "Ví nguồn",
    balance: 0,
    icon: "cash",
    color: "#6b7280",
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-muted/30">
      <div className="border-b border-border bg-background p-4 lg:p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base lg:text-lg font-bold text-foreground flex items-center gap-2">
            <Bot size={18} className="text-primary" /> Agent Capy
          </h2>
          <p className="text-2xs text-muted-foreground uppercase tracking-wider truncate">
            {contextLabel}
          </p>
        </div>

        <Button variant="outline" onClick={onBackToChat}>
          <CornerDownLeft size={16} className="mr-2" />
          Quay lại chat
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4 space-y-3 scroll-smooth bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full min-w-0 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <MessageBubblePart
              msg={{
                id: message.id,
                text: message.content,
                status: message.role === "user" ? "done" : "normal",
                transType: "expense",
              }}
              isCurrentUser={message.role === "user"}
              walletName={selectedWallet?.name || fund?.name || "Ví nguồn"}
              walletColor={selectedWallet?.color}
              walletIcon={selectedWallet?.icon}
              display={{
                showHeader: false,
                showWallet: false,
                showStatus: false,
                showAmount: false,
                showCategory: false,
              }}
            />
          </div>
        ))}
      </div>

      <ChatInputArea
        input={input}
        setInput={setInput}
        selectedWallet={selectedWalletForInput}
        isSmartMode={true}
        isAnalyzing={false}
        onSend={handleSend}
        onWalletClick={() => setShowWalletSelector(true)}
        onCategoryClick={() => {}}
      />

      <DialogWalletSelector
        data={{ data: wallets }}
        mutate={async () => ({ data: wallets })}
        open={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        selectedWalletId={selectedWallet?.id || ""}
        onSelect={(id) => {
          onSelectWallet(id);
          setShowWalletSelector(false);
        }}
      />
    </div>
  );
}
