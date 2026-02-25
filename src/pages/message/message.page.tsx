import React from "react";
import { MessageChatPart } from "@/pages/message/parts/message-chat/message-chat.part";
import { DrawerNavigation } from "@/components/elements/drawer/drawer-navigation.element";
import { FundCreatePart } from "@/pages/fund/parts/fund-create/fund-create.part";
import { FundUpdatePart } from "../fund/parts/fund-update/fund-update.part";
import { Fund } from "@/apis/funds/fund.entities";
import ChartContent from "../statistic/parts/statistic-chart/statistic-chart.part";
import { StatisticPage } from "../statistic/statistic.page";
import { useFundMembers } from "@/hooks/use-fund-members";
import { DialogFundMemberList } from "@/components/elements/dialog/dialog-fund-member-list.element";
import { OverlayTutorial } from "@/components/elements/overlay/overlay-tutorial.element";
import ShareFundDialog from "@/components/elements/dialog/dialog-share-fund.element";
import { useMessagePageState } from "./hooks/use-message-page-state";
import { SidebarPart } from "./parts/sidebar/sidebar.part";
import { useMessage } from "@/app/providers/MessageProvider";
import { useCategories } from "@/hooks/use-categories";
import { useAuth } from "@/hooks/use-auth";
import { mutate } from "swr";
import { getErrorMessage } from "@/common/utils/error.utils";
import { Wallet } from "@/apis/wallets/wallet.entities";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AgentPanel } from "./parts/agent/agent-panel.part";
import { WalletTransactionsPanel } from "@/components/elements/wallet/wallet-transactions.element";

interface MessagePageProps {
  fund: Fund | any;
  funds: Fund[];
  wallets?: Wallet[];
  currentFundId?: string;
  onSelectFund: (fundId: string) => void;
  onCreateFund: (name: string, type: "personal" | "shared") => Promise<void>;
  onUpdateFund: (
    fundId: string,
    name: string,
    type: "personal" | "shared"
  ) => Promise<void>;
  onDeleteFund: (fundId: string) => Promise<void>;
  onLogout: () => void;
  isLoadingFunds?: boolean;
  isLoadingMoreFunds?: boolean;
  hasMoreFunds?: boolean;
  onLoadMoreFunds?: () => void;
  onSearchFunds?: (query: string) => void;
}

export function MessagePage({
  fund,
  funds,
  wallets = [],
  onSelectFund,
  onCreateFund,
  onUpdateFund,
  onDeleteFund,
  onLogout,
  isLoadingFunds = false,
  isLoadingMoreFunds = false,
  hasMoreFunds = false,
  onLoadMoreFunds,
  onSearchFunds,
}: MessagePageProps) {
  // --- AUTH ---
  const { currentUserId, currentUserName, currentUser } = useAuth();

  // --- MESSAGE DATA (self-fetched) ---
  const canLoadMessages = !!fund?.id;
  const {
    messageList,
    isLoadingList: isLoadingMessages,
    loading: isProcessingMessage,
    createMessage,
    updateMessage,
    deleteMessage,
  } = useMessage(canLoadMessages ? fund.id : undefined);

  // --- CATEGORIES ---
  const { categories } = useCategories();

  // --- STATE HOOK ---
  const { dialogs, ui } = useMessagePageState(isLoadingFunds);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [activeMainView, setActiveMainView] = useState<"chat" | "agent" | "wallet">("chat");

  useEffect(() => {
    if (!selectedWalletId && wallets.length > 0) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  // --- DATA TRANSFORMS ---
  const messages = messageList?.data || [];
  const selectedFund = funds.find((f) => f.id === dialogs.member.selectedFundId);
  const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId) || null;
  const fundCategories = fund
    ? categories.filter((c) => c.fundId === fund.id)
    : [];
  const fundMessages = fund ? messages.filter((m) => m.fundId === fund.id) : [];

  // --- MEMBERS LOGIC ---
  const {
    members,
    isLoading: isLoadingMembers,
    loading: isProcessingMember,
    removeMember,
    mutate: mutateMembers,
  } = useFundMembers(dialogs.member.selectedFundId || "", {
    page: 1,
    take: 20,
  });

  // --- MESSAGE HANDLERS (now internal) ---
  const handleAddMessage = async (messageData: any) => {
    if (!fund) return;
    const payload = {
      message: messageData.message || null,
      walletId: messageData.walletId ?? null,
    };
    await createMessage(fund.id, payload);
  };

  const handleResendMessage = async (failedMessage: any, walletId?: string) => {
    if (!fund) return;
    const messageText = failedMessage.originalPrompt || failedMessage.message;
    const payload = {
      message: messageText,
      walletId: walletId ?? failedMessage.walletId ?? null,
    };
    await createMessage(fund.id, payload);
  };

  const handleUpdateMessage = async (updatedMessage: any) => {
    const payload: any = {
      message: updatedMessage.message,
      walletId: updatedMessage.walletId ?? null,
      spendValue: updatedMessage.spend,
      earnValue: updatedMessage.earn,
      categoryId: updatedMessage.categoryId,
    };
    await updateMessage(updatedMessage.id, payload);
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
  };

  // --- FUND HANDLERS ---
  const handleCreateFundComplete = async (name: string, type: "personal" | "shared") => {
    await onCreateFund(name, type);
    dialogs.createFund.close();
  };

  const handleUpdateFundComplete = async (id: string, name: string, type: "personal" | "shared") => {
    await onUpdateFund(id, name, type);
    dialogs.updateFund.close();
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
    } catch { }
  };

  const navProps = {
    funds,
    wallets,
    onDeleteFund,
    currentUserName: currentUserName || "",
    currentFundId: fund?.id || null,
    currentWalletId: selectedWalletId,
    isLoadingFunds,
    isLoadingWallets: false,
    isLoadingMore: isLoadingMoreFunds,
    hasMore: hasMoreFunds,
    onSelectFund,
    onSelectWallet: (walletId: string) => {
      setSelectedWalletId(walletId);
      setActiveMainView("wallet");
    },
    onCreateFund: dialogs.createFund.open,
    onUpdateFund: dialogs.updateFund.open,
    onLoadMore: onLoadMoreFunds || (() => { }),
    onLogout,
    onSearchFunds,
    onSearchWallets: () => { },
    onOpenAgent: () => setActiveMainView("agent"),
    isAgentMode: activeMainView === "agent",
    onExitAgentToTab: () => setActiveMainView("chat"),
    onOpenProfile: () => toast.info("Trang profile đang được phát triển"),
    onViewFundMembers: dialogs.member.open,
  };

  return (
    <React.Fragment>
      <OverlayTutorial />
      {/* Container */}
      <div
        className={`flex h-dvh lg:h-screen overflow-hidden bg-[#F0F2F5] lg:p-3 lg:gap-3 p-0 gap-0 ${ui.showLoadingScreen
          ? "opacity-0"
          : "opacity-100 transition-opacity duration-500"
          }`}
      >
        {/* CỘT 1: SIDEBAR LEFT (Desktop) */}
        <SidebarPart
          {...navProps}
          open={true}
          onOpenChange={() => { }}
        />

        {/* DRAWER CHO MOBILE/TABLET */}
        <div className="lg:hidden">
          <DrawerNavigation
            {...navProps}
            open={dialogs.drawer.isOpen}
            onOpenChange={dialogs.drawer.setOpen}
          />
        </div>

        {/* CỘT 2: CHAT MAIN VIEW */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 shadow-none border-none overflow-hidden relative">
          {activeMainView === "chat" ? (
            <MessageChatPart
              fund={fund}
              messages={fundMessages}
              categories={fundCategories}
              currentUserId={currentUserId || ""}
              currentUserName={currentUserName || ""}
              onOpenDrawer={dialogs.drawer.open}
              onCreateFund={dialogs.createFund.open}
              onShowStatistics={dialogs.statistics.open}
              onAddMessage={handleAddMessage}
              onResendMessage={handleResendMessage}
              onUpdateMessage={handleUpdateMessage}
              onDeleteMessage={handleDeleteMessage}
              isProcessing={isProcessingMessage}
              isLoading={isLoadingMessages}
              onOpenShareFundDialog={dialogs.share.toggle}
            />
          ) : activeMainView === "agent" ? (
            <AgentPanel
              fund={fund || null}
              wallets={wallets}
              selectedWallet={selectedWallet}
              onSelectWallet={(walletId) => setSelectedWalletId(walletId)}
              onBackToChat={() => setActiveMainView("chat")}
            />
          ) : activeMainView === "wallet" && selectedWalletId ? (
            <WalletTransactionsPanel
              walletId={selectedWalletId}
              onBack={() => setActiveMainView("chat")}
              onOpenDrawer={dialogs.drawer.open}
            />
          ) : (
            <MessageChatPart
              fund={fund}
              messages={fundMessages}
              categories={fundCategories}
              currentUserId={currentUserId || ""}
              currentUserName={currentUserName || ""}
              onOpenDrawer={dialogs.drawer.open}
              onCreateFund={dialogs.createFund.open}
              onShowStatistics={dialogs.statistics.open}
              onAddMessage={handleAddMessage}
              onResendMessage={handleResendMessage}
              onUpdateMessage={handleUpdateMessage}
              onDeleteMessage={handleDeleteMessage}
              isProcessing={isProcessingMessage}
              isLoading={isLoadingMessages}
              onOpenShareFundDialog={dialogs.share.toggle}
            />
          )}
        </main>

        {/* CỘT 3: STATISTIC VIEW (Desktop Right) */}
        {activeMainView === "chat" && (
          <aside className="hidden xl:flex w-[400px] bg-white flex-col shrink-0 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Thống kê chi tiết
                </h2>
              </div>
            </div>
            <ChartContent fundId={fund?.id} />
          </aside>
        )}

        {/* --- DIALOGS --- */}

        {/* STATISTIC DRAWER (Mobile) */}
        <StatisticPage
          isOpen={activeMainView === "chat" && dialogs.statistics.isOpen}
          onClose={dialogs.statistics.close}
          fundId={fund?.id}
          totalExpense={0}
          totalIncome={0}
        />

        <FundCreatePart
          open={dialogs.createFund.isOpen}
          onOpenChange={dialogs.createFund.setOpen}
          onCreateFund={handleCreateFundComplete}
          currentUserId={currentUserId || ""}
          allUsers={currentUser ? [currentUser] : []}
        />

        <FundUpdatePart
          fund={fund}
          open={dialogs.updateFund.isOpen}
          onOpenChange={dialogs.updateFund.setOpen}
          onUpdateFund={handleUpdateFundComplete}
          currentUserId={currentUserId || ""}
          allUsers={currentUser ? [currentUser] : []}
        />

        <DialogFundMemberList
          isOpen={dialogs.member.isOpen}
          onClose={dialogs.member.close}
          fund={selectedFund}
          members={members}
          isLoading={isLoadingMembers || isProcessingMember}
          onRefresh={() => mutateMembers()}
          onRemoveMember={handleRemoveMember}
          currentUserId={currentUserId || ""}
        />

        <ShareFundDialog
          isOpen={dialogs.share.isOpen}
          onClose={dialogs.share.close}
          fund={fund}
        />
      </div>
    </React.Fragment>
  );
}
