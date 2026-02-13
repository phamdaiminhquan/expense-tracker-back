import { Fund, Category } from "@/common/lib/types.lib";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/common/lib/currency.lib";
import { Card } from "@/components/ui/card";
import { TrendUp, TrendDown, Wallet, User, Tag } from "@phosphor-icons/react";
import { getStatisticsByFundId } from "@/apis/statistics/statistic.api";
import { StatisticDto } from "@/apis/statistics/statistic.interface";
import { useEffect, useState } from "react";

interface DialogFundStatisticProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  fund: Fund | null;
  resolveUserName: (userId: string) => string;
}

export function DialogFundStatistic({
  open,
  onOpenChange,
  categories,
  fund,
  resolveUserName,
}: DialogFundStatisticProps) {
  const [statistics, setStatistics] = useState<StatisticDto | null>(null);

  useEffect(() => {
    if (!fund?.id) return;
    getStatisticsByFundId(fund.id).then((data) => {
      setStatistics(data);
    });
  }, [fund?.id]);

  // Hiển thị số liệu tổng hợp từ statistics
  const totalSpend = statistics?.totalSpend || 0;
  const totalEarn = statistics?.totalEarn || 0;
  const balance = statistics?.net || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Báo cáo chi tiêu
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 space-y-3 border-destructive/30 bg-linear-to-br from-destructive/10 to-destructive/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/10 rounded-full blur-xl -mr-8 -mt-8" />
              <div className="flex items-center gap-2 text-destructive relative z-10">
                <div className="p-1.5 rounded-lg bg-destructive/20">
                  <TrendDown size={18} weight="bold" />
                </div>
                <span className="text-sm font-semibold">Tổng chi</span>
              </div>
              <p className="text-2xl font-bold font-mono relative z-10">
                {formatCurrency(totalSpend)}
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-accent/30 bg-linear-to-br from-accent/10 to-accent/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-full blur-xl -mr-8 -mt-8" />
              <div className="flex items-center gap-2 text-accent relative z-10">
                <div className="p-1.5 rounded-lg bg-accent/20">
                  <TrendUp size={18} weight="bold" />
                </div>
                <span className="text-sm font-semibold">Tổng thu</span>
              </div>
              <p className="text-2xl font-bold font-mono relative z-10">
                {formatCurrency(totalEarn)}
              </p>
            </Card>

            <Card
              className={`p-5 space-y-3 border-primary/30 ${
                balance >= 0
                  ? "bg-linear-to-br from-primary/10 to-primary/5"
                  : "bg-linear-to-br from-destructive/10 to-destructive/5"
              } backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden relative`}
            >
              <div
                className={`absolute top-0 right-0 w-16 h-16 ${
                  balance >= 0 ? "bg-primary/10" : "bg-destructive/10"
                } rounded-full blur-xl -mr-8 -mt-8`}
              />
              <div
                className={`flex items-center gap-2 ${
                  balance >= 0 ? "text-primary" : "text-destructive"
                } relative z-10`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    balance >= 0 ? "bg-primary/20" : "bg-destructive/20"
                  }`}
                >
                  <Wallet size={18} weight="bold" />
                </div>
                <span className="text-sm font-semibold">Số dư</span>
              </div>
              <p
                className={`text-2xl font-bold font-mono relative z-10 ${
                  balance >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
