import React from "react";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, HandCoins, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/common/lib/currency.lib";
import type { WalletTransaction } from "@/apis/wallets/wallet.interface";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";

// ─── Helpers ──────────────────────────────────────────────

const formatTxDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── EXPENSE Card ─────────────────────────────────────────

export const ExpenseCard: React.FC<{ tx: WalletTransaction }> = ({ tx }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-rose-100 bg-white hover:shadow-sm transition-shadow">
    <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
      <ArrowDownLeft size={16} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground truncate">{tx.content}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {tx.category && (
          <>
            <span className="text-2xs text-rose-400 font-medium truncate">{tx.category.name}</span>
            <span className="text-2xs text-muted-foreground">·</span>
          </>
        )}
        <span className="text-2xs text-muted-foreground whitespace-nowrap">{formatTxDate(tx.createdAt)}</span>
      </div>
    </div>
    <p className="text-sm font-bold text-rose-500 whitespace-nowrap">
      -{formatCurrency(tx.spendValue || 0)}
    </p>
  </div>
);

// ─── INCOME Card ──────────────────────────────────────────

export const IncomeCard: React.FC<{ tx: WalletTransaction }> = ({ tx }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-100 bg-white hover:shadow-sm transition-shadow">
    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
      <ArrowUpRight size={16} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground truncate">{tx.content}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {tx.category && (
          <>
            <span className="text-2xs text-emerald-500 font-medium truncate">{tx.category.name}</span>
            <span className="text-2xs text-muted-foreground">·</span>
          </>
        )}
        <span className="text-2xs text-muted-foreground whitespace-nowrap">{formatTxDate(tx.createdAt)}</span>
      </div>
    </div>
    <p className="text-sm font-bold text-emerald-500 whitespace-nowrap">
      +{formatCurrency(tx.earnValue || 0)}
    </p>
  </div>
);

// ─── INTERNAL (Transfer) Card ─────────────────────────────
// TODO: BE cần trả thêm fromWallet/toWallet cho INTERNAL
// Hiện tại dùng content + spendValue để hiển thị

export const InternalCard: React.FC<{ tx: WalletTransaction }> = ({ tx }) => {
  const fromStyle = tx.fromWallet
    ? WALLET_TEMPLATES.find((t) => t.code === tx.fromWallet!.icon) ||
      WALLET_TEMPLATES.find((t) => t.code === "custom")
    : null;
  const toStyle = tx.toWallet
    ? WALLET_TEMPLATES.find((t) => t.code === tx.toWallet!.icon) ||
      WALLET_TEMPLATES.find((t) => t.code === "custom")
    : null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-blue-100 bg-white hover:shadow-sm transition-shadow">
      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
        <ArrowLeftRight size={16} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        {tx.fromWallet && tx.toWallet ? (
          <>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <div className="flex items-center gap-1 min-w-0">
                {fromStyle?.img && (
                  <img src={fromStyle.img} alt="" className="w-4 h-4 object-contain shrink-0" />
                )}
                <span className="truncate" style={{ color: tx.fromWallet.color || fromStyle?.text }}>
                  {tx.fromWallet.name}
                </span>
              </div>
              <ArrowLeftRight size={12} className="text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1 min-w-0">
                {toStyle?.img && (
                  <img src={toStyle.img} alt="" className="w-4 h-4 object-contain shrink-0" />
                )}
                <span className="truncate" style={{ color: tx.toWallet.color || toStyle?.text }}>
                  {tx.toWallet.name}
                </span>
              </div>
            </div>
            <p className="text-2xs text-muted-foreground mt-0.5">{tx.content}</p>
          </>
        ) : (
          <p className="text-sm font-medium text-foreground truncate">{tx.content}</p>
        )}
        <span className="text-2xs text-muted-foreground whitespace-nowrap">{formatTxDate(tx.createdAt)}</span>
      </div>
      <p className="text-sm font-bold text-blue-500 whitespace-nowrap">
        {formatCurrency(tx.spendValue || tx.earnValue || 0)}
      </p>
    </div>
  );
};

// ─── DEBT Card ────────────────────────────────────────────
// TODO: BE cần trả thêm debtorName/dueDate cho DEBT

export const DebtCard: React.FC<{ tx: WalletTransaction }> = ({ tx }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-amber-100 bg-white hover:shadow-sm transition-shadow">
    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
      <HandCoins size={16} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground truncate">{tx.content}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {tx.debtorName && (
          <>
            <span className="text-2xs text-amber-600 font-medium truncate">{tx.debtorName}</span>
            <span className="text-2xs text-muted-foreground">·</span>
          </>
        )}
        <span className="text-2xs text-muted-foreground whitespace-nowrap">{formatTxDate(tx.createdAt)}</span>
        {tx.dueDate && (
          <>
            <span className="text-2xs text-muted-foreground">·</span>
            <span className="text-2xs text-amber-500 whitespace-nowrap">
              Hạn: {new Date(tx.dueDate).toLocaleDateString("vi-VN")}
            </span>
          </>
        )}
      </div>
    </div>
    <p className="text-sm font-bold text-amber-600 whitespace-nowrap">
      {tx.spendValue ? `-${formatCurrency(tx.spendValue)}` : `+${formatCurrency(tx.earnValue || 0)}`}
    </p>
  </div>
);

// ─── REVERSAL Card ────────────────────────────────────────
// TODO: BE cần trả thêm originalTransactionId cho REVERSAL

export const ReversalCard: React.FC<{ tx: WalletTransaction }> = ({ tx }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 bg-gray-50/50 hover:shadow-sm transition-shadow">
    <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
      <RotateCcw size={16} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground truncate line-through decoration-gray-300">{tx.content}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-2xs text-gray-400 font-medium">Hoàn tiền</span>
        <span className="text-2xs text-muted-foreground">·</span>
        <span className="text-2xs text-muted-foreground whitespace-nowrap">{formatTxDate(tx.createdAt)}</span>
      </div>
    </div>
    <p className="text-sm font-bold text-gray-500 whitespace-nowrap">
      {tx.earnValue ? `+${formatCurrency(tx.earnValue)}` : `-${formatCurrency(tx.spendValue || 0)}`}
    </p>
  </div>
);

// ─── Router component ─────────────────────────────────────

export const TransactionCard: React.FC<{ tx: WalletTransaction }> = ({ tx }) => {
  switch (tx.type) {
    case "EXPENSE":
      return <ExpenseCard tx={tx} />;
    case "INCOME":
      return <IncomeCard tx={tx} />;
    case "INTERNAL":
      return <InternalCard tx={tx} />;
    case "DEBT":
      return <DebtCard tx={tx} />;
    case "REVERSAL":
      return <ReversalCard tx={tx} />;
    default:
      return <ExpenseCard tx={tx} />;
  }
};
