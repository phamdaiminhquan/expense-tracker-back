import { useState, useEffect, useRef } from "react";
import { Message, Category } from "@/lib/types";
import { FundStatisticsDialog } from "@/components/FundStatisticsDialog";
// import { CategoryManagementDialog } from '@/components/CategoryManagementDialog'
import { CategorySubscriptionDialog } from "@/components/CategorySubscriptionDialog";
import { MessageChatPart } from "@/pages/message/parts/message-chat/message-chat.part";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { FundCreatePart } from "@/pages/fund/parts/fund-create/fund-create.part";
import React from "react";
import { FundUpdatePart } from "../fund/parts/fund-update/fund-update.part";
import { Fund } from "@/apis/funds/fund.entities";
import ChartContent from "../statistic/parts/statistic-chart/statistic-chart.part";
import { StatisticPage } from "../statistic/statistic.page";
import { useFundMembers } from "@/hooks/use-fund-members.hook";

import { FundMemberListDialog } from "@/components/MemberListDialog";

interface MessagePageProps {
  fund: Fund | null;
  funds: Fund[];
  messages: Message[];
  categories: Category[];
  currentUserId: string;
  currentUserName: string;
  currentUser: any;
  resolveUserName: (userId: string) => string;
  onSelectFund: (fundId: string) => void;
  onCreateFund: (
    name: string,
    type: "personal" | "shared",
    memberIds: string[]
  ) => Promise<void>;
  onUpdateFund: (
    fundId: string,
    name: string,
    type: "personal" | "shared"
  ) => Promise<void>;
  onDeleteFund: (fundId: string) => Promise<void>;
  onLogout: () => void;
  onAddMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  onResendMessage: (message: Message) => Promise<void>;
  onUpdateMessage: (message: Message) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  isProcessing?: boolean;
  isLoading?: boolean;
  isLoadingFunds?: boolean;
  isLoadingMoreFunds?: boolean;
  hasMoreFunds?: boolean;
  onLoadMoreFunds?: () => void;
  onSearchFunds?: (query: string) => void;
}

export function MessagePage({
  fund,
  funds,
  messages,
  categories,
  currentUserId,
  currentUserName,
  currentUser,
  resolveUserName,
  onSelectFund,
  onCreateFund,
  onUpdateFund,
  onDeleteFund,
  onLogout,
  onAddMessage,
  onResendMessage,
  onUpdateMessage,
  onDeleteMessage,
  isProcessing = false,
  isLoading = false,
  isLoadingFunds = false,
  isLoadingMoreFunds = false,
  hasMoreFunds = false,
  onLoadMoreFunds,
  onSearchFunds,
}: MessagePageProps) {
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCategorySubscriptionOpen, setIsCategorySubscriptionOpen] =
    useState(false);
  const [isAutoCategorySubscription, setIsAutoCategorySubscription] =
    useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false);
  const [isUpdateFundDialogOpen, setIsUpdateFundDialogOpen] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const hasShownInitialBanner = useRef(false);

  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [memberPage, setMemberPage] = useState(1);
  const pageSize = 20;

  // Sử dụng custom hook để lấy danh sách member, phân trang, mời/xóa member
  const {
    members,
    isLoading: isLoadingMembers,
    loading: isProcessingMember,
    inviteMember,
    removeMember,
    mutate: mutateMembers,
  } = useFundMembers(selectedFundId || "", {
    page: memberPage,
    take: pageSize,
  });

  // Hiển thị banner khi đang load funds (lần đầu vào app)
  useEffect(() => {
    if (hasShownInitialBanner.current) return;

    // Chỉ hiển thị lần đầu khi vào app và đang load funds
    const hasSeenBanner = sessionStorage.getItem("hasSeenChatBanner");
    if (!hasSeenBanner && isLoadingFunds) {
      hasShownInitialBanner.current = true;
      setShowLoadingScreen(true);
      sessionStorage.setItem("hasSeenChatBanner", "true");
    }
  }, [isLoadingFunds]);

  // Tự động ẩn banner khi load xong (không cần user action)
  useEffect(() => {
    if (showLoadingScreen && !isLoadingFunds) {
      // Set showLoadingScreen = false để hiển thị nội dung
      setShowLoadingScreen(false);
    }
  }, [showLoadingScreen, isLoadingFunds]);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  const handleOpenCreateFund = () => {
    setIsCreateFundDialogOpen(true);
    setIsDrawerOpen(false);
  };

  const handleOpenUpdateFund = () => {
    setIsUpdateFundDialogOpen(true);
    setIsDrawerOpen(false);
  };

  const handleCreateFundComplete = async (
    name: string,
    type: "personal" | "shared",
    memberIds: string[]
  ) => {
    await onCreateFund(name, type, memberIds);
    setIsCreateFundDialogOpen(false);
  };
  const handleUpdateFundComplete = async (
    id: string,
    name: string,
    type: "personal" | "shared"
  ) => {
    await onUpdateFund(id, name, type);
    setIsUpdateFundDialogOpen(false);
  };

  const fundCategories = fund
    ? categories.filter((c) => c.fundId === fund.id)
    : [];
  const fundMessages = fund ? messages.filter((m) => m.fundId === fund.id) : [];
  // useEffect(() => {
  //   if (!fund?.id) return;
  //   if (fund.isOpenDialogCate) {
  //     setIsAutoCategorySubscription(true);
  //     setIsCategorySubscriptionOpen(true);
  //   }
  // }, [fund?.id, fund?.isOpenDialogCate]);

  // Hàm mở dialog member khi chọn icon xem thành viên
  const handleViewFundMembers = (fundId: string) => {
    setSelectedFundId(fundId);
    setIsMemberDialogOpen(true);
  };

  const handleCloseMemberDialog = () => {
    setIsMemberDialogOpen(false);
    setSelectedFundId(null);
  };

  const selectedFund = funds.find((f) => f.id === selectedFundId);

  // Định nghĩa hàm wrapper để truyền đúng props cho dialog
  const handleInviteMember = async (payload: any) => {
    try {
      await inviteMember(payload);
    } catch {}
  };
  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
    } catch {}
  };

  return (
    <React.Fragment>
      {/* Container: p-0 trên mobile, p-3 trên desktop */}
      <div
        className={`flex h-dvh lg:h-screen overflow-hidden bg-[#F0F2F5] lg:p-3 lg:gap-3 p-0 gap-0 ${
          showLoadingScreen
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-500"
        }`}
      >
        {/* CỘT 1: SIDEBAR LEFT - Chỉ hiện trên lg, giữ nguyên card style vì là desktop */}
        <aside className="hidden lg:flex w-[350px] bg-white flex-col shrink-0 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <NavigationDrawer
            open={true}
            onOpenChange={() => {}}
            funds={funds}
            onDeleteFund={onDeleteFund}
            currentUserName={currentUserName}
            currentFundId={fund?.id || null}
            isLoadingFunds={isLoadingFunds}
            isLoadingMore={isLoadingMoreFunds}
            hasMore={hasMoreFunds}
            onSelectFund={onSelectFund}
            onCreateFund={handleOpenCreateFund}
            onUpdateFund={handleOpenUpdateFund}
            onLoadMore={onLoadMoreFunds || (() => {})}
            onLogout={onLogout}
            onSearchFunds={onSearchFunds}
            isPermanent={true}
            onViewFundMembers={handleViewFundMembers}
          />
        </aside>

        {/* DRAWER CHO MOBILE/TABLET */}
        <div className="lg:hidden">
          <NavigationDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            funds={funds}
            onDeleteFund={onDeleteFund}
            currentUserName={currentUserName}
            currentFundId={fund?.id || null}
            isLoadingFunds={isLoadingFunds}
            isLoadingMore={isLoadingMoreFunds}
            hasMore={hasMoreFunds}
            onSelectFund={onSelectFund}
            onCreateFund={handleOpenCreateFund}
            onUpdateFund={handleOpenUpdateFund}
            onLoadMore={onLoadMoreFunds || (() => {})}
            onLogout={onLogout}
            onSearchFunds={onSearchFunds}
            onViewFundMembers={handleViewFundMembers}
          />
        </div>

        {/* CỘT 2: CHAT MAIN VIEW - Bo góc trên desktop, tràn viền trên mobile */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 shadow-none border-none overflow-hidden relative">
          <MessageChatPart
            fund={fund}
            messages={fundMessages}
            categories={fundCategories}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onShowStatistics={() => setIsStatisticsDialogOpen(true)}
            onAddMessage={onAddMessage}
            onResendMessage={onResendMessage}
            onUpdateMessage={onUpdateMessage}
            onDeleteMessage={onDeleteMessage}
            isProcessing={isProcessing}
            isLoading={isLoading}
            // onManageCategories={() => setIsCategoryDialogOpen(true)}
            // onShowCategorySubscription={() => {
            //   setIsAutoCategorySubscription(false);
            //   setIsCategorySubscriptionOpen(true);
            // }}
            // resolveUserName={resolveUserName}
            // isLoadingFunds={isLoadingFunds}
            // onSelectFund={onSelectFund}
            // funds={funds}
          />
        </main>

        {/* CỘT 3: STATISTIC VIEW - Giữ nguyên card style trên desktop */}
        <aside className="hidden xl:flex w-[380px] bg-white flex-col shrink-0 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">
              Thống kê chi tiết
            </h2>
            <ChartContent
              messages={fundMessages}
              totalExpense={0}
              totalIncome={0}
            />
          </div>
        </aside>

        {/* DRAWER CHO MOBILE/TABLET (SIDEBAR RIGHT / STATISTIC) */}
        <StatisticPage
          isOpen={isStatisticsDialogOpen}
          onClose={() => setIsStatisticsDialogOpen(false)}
          messages={fundMessages}
          totalExpense={0}
          totalIncome={0}
        />

        <FundCreatePart
          open={isCreateFundDialogOpen}
          onOpenChange={setIsCreateFundDialogOpen}
          onCreateFund={handleCreateFundComplete}
          currentUserId={currentUserId}
          allUsers={currentUser ? [currentUser] : []}
        />

        <FundUpdatePart
          fund={fund!}
          open={isUpdateFundDialogOpen}
          onOpenChange={setIsUpdateFundDialogOpen}
          onUpdateFund={handleUpdateFundComplete}
          currentUserId={currentUserId}
          allUsers={currentUser ? [currentUser] : []}
        />

        <FundMemberListDialog
          isOpen={isMemberDialogOpen}
          onClose={handleCloseMemberDialog}
          fund={selectedFund || { id: "", name: "", type: "shared" }}
          members={members}
          isLoading={isLoadingMembers || isProcessingMember}
          onRefresh={() => mutateMembers()}
          // onInviteMember={handleInviteMember}
          onRemoveMember={handleRemoveMember}
          currentUserId={currentUserId}
        />
      </div>
    </React.Fragment>
  );
}
