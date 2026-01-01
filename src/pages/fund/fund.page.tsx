import React, { useMemo, useState } from "react";
import { FundListPart } from "@/pages/fund/parts/fund-list/fund-list.part";
import { FundCreatePart } from "@/pages/fund/parts/fund-create/fund-create.part";
import { User } from "@/lib/auth";
import { toast } from "sonner";
import { Fund } from "@/apis/funds/fund.entities";

interface FundListPageProps {
  currentUserId: string;
  currentUserName: string;
  currentUser: User | null;
  funds: Fund[];
  isLoadingFunds?: boolean;
  onRefreshFunds?: () => void;
  onSelectFund: (fund: Fund) => void;
  onCreateFund: (
    name: string,
    type: "personal" | "shared",
    memberIds: string[]
  ) => Promise<void>;
  onLogout: () => void;
}

export function FundPage({
  currentUserId,
  currentUserName,
  currentUser,
  funds,
  isLoadingFunds = false,
  onRefreshFunds,
  onSelectFund,
  onCreateFund,
  onLogout,
}: FundListPageProps) {
  const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false);

  const visibleFunds = useMemo(() => funds, [funds]);

  const handleCreateFund = async (
    name: string,
    type: "personal" | "shared",
    memberIds: string[]
  ) => {
    try {
      await onCreateFund(name, type, memberIds);
      toast.success("Đã tạo quỹ thành công!", { description: name });
    } catch (error) {
      console.error(error);
      toast.error("Tạo quỹ thất bại", { description: "Vui lòng thử lại" });
    }
  };

  const handleSelectFund = (fundId: string) => {
    const found = funds.find((f) => f.id === fundId);
    if (found) {
      onSelectFund(found);
    }
  };

  return (
    <React.Fragment>
      <FundListPart
        funds={visibleFunds}
        currentUserName={currentUserName}
        onSelectFund={handleSelectFund}
        onCreateFund={() => setIsCreateFundDialogOpen(true)}
        onLogout={onLogout}
        isLoading={isLoadingFunds}
        onRefresh={onRefreshFunds}
      />

      <FundCreatePart
        open={isCreateFundDialogOpen}
        onOpenChange={setIsCreateFundDialogOpen}
        onCreateFund={handleCreateFund}
        currentUserId={currentUserId}
        allUsers={currentUser ? [currentUser] : []}
      />
    </React.Fragment>
  );
}
