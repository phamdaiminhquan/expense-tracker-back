import React from "react";
import useSWR from "swr";
import { ChevronLeft, Menu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/common/lib/currency.lib";
import { getWalletTransactions } from "@/apis/wallets/wallet.api";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";
import { TransactionCard } from "./transaction-card.element";

interface WalletTransactionsPanelProps {
  walletId: string;
  onBack: () => void;
  onOpenDrawer?: () => void;
}

export const WalletTransactionsPanel: React.FC<WalletTransactionsPanelProps> = ({
  walletId,
  onBack,
  onOpenDrawer,
}) => {
  const { data, isLoading } = useSWR(
    walletId ? `wallet-transactions-${walletId}` : null,
    () => getWalletTransactions(walletId),
    { revalidateOnFocus: false }
  );

  const wallet = data?.wallet;
  const transactions = data?.data || [];
  const total = data?.total || 0;

  const style = wallet
    ? WALLET_TEMPLATES.find((t) => t.code === wallet.icon) ||
      WALLET_TEMPLATES.find((t) => t.code === "custom")
    : null;

  // Summary calculations
  const totalExpense = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + (tx.spendValue || 0), 0);
  const totalIncome = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + (tx.earnValue || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          {onOpenDrawer && (
            <button
              onClick={onOpenDrawer}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} className="text-gray-500" />
            </button>
          )}

          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </button>

          {isLoading || !wallet ? (
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: style?.bgLight || "#F3F4F6" }}
              >
                <img
                  src={style?.img}
                  alt={wallet.name}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-base font-bold truncate"
                  style={{ color: wallet.color || style?.text }}
                >
                  {wallet.name}
                </p>
                <p className="text-xs text-gray-400">
                  Số dư: {formatCurrency(wallet.balance)} ₫
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      {!isLoading && wallet && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-4">
          <div className="flex-1 text-center">
            <p className="text-2xs text-gray-400 uppercase tracking-wider font-medium">Chi tiêu</p>
            <p className="text-sm font-bold text-rose-500 mt-0.5">-{formatCurrency(totalExpense)}</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex-1 text-center">
            <p className="text-2xs text-gray-400 uppercase tracking-wider font-medium">Thu nhập</p>
            <p className="text-sm font-bold text-emerald-500 mt-0.5">+{formatCurrency(totalIncome)}</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex-1 text-center">
            <p className="text-2xs text-gray-400 uppercase tracking-wider font-medium">Giao dịch</p>
            <p className="text-sm font-bold text-gray-700 mt-0.5">{total}</p>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: style?.bgLight || "#F3F4F6" }}
            >
              <img
                src={style?.img}
                alt=""
                className="w-8 h-8 object-contain opacity-50"
              />
            </div>
            <p className="text-gray-800 font-bold mb-1">Chưa có giao dịch</p>
            <p className="text-sm text-gray-400 max-w-[220px]">
              Các giao dịch liên quan đến ví này sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))
        )}
      </div>
    </div>
  );
};
