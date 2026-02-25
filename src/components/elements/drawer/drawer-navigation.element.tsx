import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Fund } from "@/apis/funds/fund.entities";
import { Wallet as WalletEntity } from "@/apis/wallets/wallet.entities";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";
import { FundItem } from "../fund/fund-item.element";
import { debounce } from "@mui/material";
import { Button } from "../../ui/button";
import { DrawerNavRail } from "./drawer-nav-rail.element";

interface DrawerNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funds: Fund[];
  wallets?: WalletEntity[];
  currentUserName: string;
  currentFundId: string | null;
  currentWalletId?: string | null;
  isLoadingFunds?: boolean;
  isLoadingWallets?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onDeleteFund: (fundId: string) => Promise<void>;
  onSelectFund: (fundId: string) => void;
  onSelectWallet?: (walletId: string) => void;
  onCreateFund: () => void;
  onUpdateFund: (fundId: string) => void;
  onLoadMore: () => void;
  onLogout: () => void;
  onSearchFunds?: (query: string) => void;
  onSearchWallets?: (query: string) => void;
  onViewFundMembers: (fundId: string) => void;
  onOpenAgent?: () => void;
  onOpenProfile?: () => void;
  isAgentMode?: boolean;
  onExitAgentToTab?: (tab: "funds" | "wallets") => void;
  /** Controlled active tab (used when rail is rendered outside, e.g. desktop SidebarPart) */
  activeTabControlled?: "funds" | "wallets";
  onChangeTabControlled?: (tab: "funds" | "wallets") => void;
}

export function DrawerNavigation({
  open,
  onOpenChange,
  funds,
  wallets = [],
  currentUserName,
  currentFundId,
  currentWalletId,
  isLoadingFunds = false,
  isLoadingWallets = false,
  isLoadingMore = false,
  hasMore = false,
  onDeleteFund,
  onSelectFund,
  onSelectWallet,
  onCreateFund,
  onUpdateFund,
  onLoadMore,
  onLogout,
  onSearchFunds,
  onSearchWallets,
  onViewFundMembers,
  onOpenAgent,
  onOpenProfile,
  isAgentMode = false,
  onExitAgentToTab,
  activeTabControlled,
  onChangeTabControlled,
  isPermanent = false,
}: DrawerNavigationProps & { isPermanent?: boolean }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTabInternal, setActiveTabInternal] = useState<"funds" | "wallets">("funds");
  const activeTab = activeTabControlled ?? activeTabInternal;
  const setActiveTab = (tab: "funds" | "wallets") => {
    setActiveTabInternal(tab);
    onChangeTabControlled?.(tab);
  };
  const [searchValue, setSearchValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isFundsTab = activeTab === "funds";

  useEffect(() => {
    if (!open || !hasMore || isLoadingMore || !isFundsTab) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage >= 0.7 && !isLoadingMore && hasMore) {
        onLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [open, hasMore, isLoadingMore, onLoadMore, isFundsTab]);

  const handleSelectFund = useCallback(
    (fundId: string) => {
      onSelectFund(fundId);
      if (!isPermanent) onOpenChange(false);
    },
    [onSelectFund, onOpenChange, isPermanent]
  );

  const handleCreateFund = useCallback(() => {
    onCreateFund();
    if (!isPermanent) onOpenChange(false);
  }, [onCreateFund, onOpenChange, isPermanent]);

  const handleUpdateFund = (e: React.MouseEvent, fundId: string) => {
    e.stopPropagation();
    onUpdateFund(fundId);
    if (!isPermanent) onOpenChange(false);
  };

  const handleDeleteFund = (e: React.MouseEvent, fundId: string) => {
    e.stopPropagation();
    onDeleteFund(fundId);
  };

  const debounceSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (isFundsTab) {
          onSearchFunds?.(value);
          return;
        }
        onSearchWallets?.(value);
      }, 500),
    [onSearchFunds, onSearchWallets, isFundsTab]
  );

  const filteredFunds = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return funds;
    return funds.filter((fund) => fund.name.toLowerCase().includes(query));
  }, [funds, searchValue]);

  const filteredWallets = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return wallets;
    return wallets.filter((wallet) =>
      wallet.name.toLowerCase().includes(query)
    );
  }, [wallets, searchValue]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const handleSwitchTab = (tab: "funds" | "wallets") => {
    if (isAgentMode) {
      onExitAgentToTab?.(tab);
    }
    setActiveTab(tab);
    setSearchValue("");
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debounceSearch?.(value);
  };

  const handleViewFundMembers = (e: React.MouseEvent, fundId: string) => {
    e.stopPropagation();
    onViewFundMembers(fundId);
    if (!isPermanent) onOpenChange(false);
  };

  const SidebarContent = (
    <div className="w-full h-full p-0 flex overflow-hidden bg-background">
      {!isPermanent && (
        <div className="relative z-20 h-full w-16 shrink-0">
          <div
            className={`h-full overflow-hidden border ${
              isAgentMode
                ? "rounded-full border-border bg-background shadow-sm"
                : "rounded-l-[1.75rem] rounded-r-none border-transparent bg-muted/20 shadow-none"
            }`}
          >
            <DrawerNavRail
              currentUserName={currentUserName}
              activeTab={activeTab}
              onChangeTab={handleSwitchTab}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenAgent={onOpenAgent}
              onOpenProfile={onOpenProfile}
              isPillMode={isAgentMode}
              isAgentMode={isAgentMode}
            />
          </div>
        </div>
      )}

      <div
        className={`relative z-0 min-w-0 flex-1 flex flex-col overflow-hidden bg-background ${
          !isPermanent
            ? `origin-left transform-gpu transition-[transform,opacity] duration-300 ease-in-out ${
                isAgentMode
                  ? "scale-x-0 opacity-0 pointer-events-none"
                  : "scale-x-100 opacity-100"
              }`
            : ""
        }`}
      >
        <>
        <div className="p-4 pb-3 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {isFundsTab ? "Danh sách quỹ" : "Danh sách ví"}
              </h2>
              <p className="text-2xs text-muted-foreground uppercase tracking-wider">
                {isFundsTab ? "Message" : "Wallet"}
              </p>
            </div>
            {!isPermanent && (
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                <ChevronLeft size={18} className="text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={isFundsTab ? "Tìm kiếm quỹ..." : "Tìm kiếm ví..."}
              className="text-foreground w-full pl-9 pr-3 py-2.5 bg-muted rounded-lg text-sm border border-border"
            />
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 space-y-2">
          {isFundsTab && (
            <div className="flex items-center justify-between px-1 mb-2">
              <h3 className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">
                Quỹ
              </h3>
              <button
                onClick={handleCreateFund}
                className="cursor-pointer p-1.5 bg-primary/15 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          )}

          {isFundsTab ? (
            isLoadingFunds ? (
              <div className="space-y-3 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              filteredFunds.map((fund) => (
                <FundItem
                  key={fund.id}
                  fund={fund}
                  isActive={fund.id === currentFundId}
                  onSelect={() => handleSelectFund(fund.id)}
                  onEdit={(e) => handleUpdateFund(e, fund.id)}
                  onDelete={(e) => handleDeleteFund(e, fund.id)}
                  onViewMembers={(e) => handleViewFundMembers(e, fund.id)}
                />
              ))
            )
          ) : isLoadingWallets ? (
            <div className="space-y-3 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWallets.length === 0 ? (
            <div className="text-sm text-muted-foreground p-3">Chưa có ví phù hợp.</div>
          ) : (
            filteredWallets.map((wallet) => {
              const style =
                WALLET_TEMPLATES.find((t) => t.code === wallet.icon) ||
                WALLET_TEMPLATES.find((t) => t.code === "custom");

              return (
                <button
                  key={wallet.id}
                  onClick={() => {
                    onSelectWallet?.(wallet.id);
                    if (!isPermanent) onOpenChange(false);
                  }}
                  className={`cursor-pointer w-full text-left p-3 rounded-xl border transition-colors ${
                    wallet.id === currentWalletId
                      ? "border-primary/40 bg-primary/10"
                      : "border-border hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: style?.bgLight || "#F3F4F6" }}
                    >
                      <img
                        src={style?.img}
                        alt={wallet.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: wallet.color || style?.text }}
                      >
                        {wallet.name}
                      </p>
                      <p className="text-2xs text-muted-foreground">{formatCurrency(wallet.balance)}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}

          {isFundsTab && isLoadingMore && (
            <div className="flex justify-center p-2">
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          )}
        </div>
        </>
      </div>
    </div>
  );

  const SettingsDialog = (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
          <DialogDescription>Tạm thời chỉ hỗ trợ đăng xuất.</DialogDescription>
        </DialogHeader>

        <Button
          onClick={onLogout}
          className="w-full mt-2"
          variant="destructive"
        >
          <LogOut size={16} className="mr-2" />
          Đăng xuất
        </Button>
      </DialogContent>
    </Dialog>
  );

  if (isPermanent) {
    // Rail and SettingsDialog are owned by SidebarPart when in permanent (desktop) mode
    return <>{SidebarContent}</>;
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className={`${
            isAgentMode
              ? "w-16 sm:w-16 p-0 flex flex-col overflow-hidden border-none shadow-none bg-transparent [&>button]:hidden"
              : "w-[85%] sm:w-[400px] p-0 flex flex-col overflow-hidden border-none shadow-2xl bg-white [&>button]:hidden"
          }`}
        >
          {SidebarContent}
        </SheetContent>
      </Sheet>
      {SettingsDialog}
    </>
  );
}
