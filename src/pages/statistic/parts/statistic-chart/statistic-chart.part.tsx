import React, { useMemo, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import { ResponsiveContainer } from "recharts";
import useSWR from "swr";
import { getStatisticsByFundIdDetail } from "@/apis/statistics/statistic.api";
import { Range, TransactionType } from "@/apis/statistics/statistic.enum";
import {
  getCategoriesStatisticDto,
  getListStatisticsDto,
} from "@/apis/statistics/statistic.interface";
import { BarChartComponent } from "@/components/components-mui/charts/bar-chart.component";
import { PieChartComponent } from "@/components/components-mui/charts/pie-chart.component";
import { formatVND } from "@/common/utils/number.utils";

interface Props {
  fundId?: string | null;
  totalExpense?: number;
  totalIncome?: number;
}

const StatisticChartPart: React.FC<Props> = ({
  fundId,
  totalExpense,
  totalIncome,
}) => {
  const [activeTab, setActiveTab] = useState("expense");
  const [chartType, setChartType] = useState("pie");
  // Fetch statistics for current fund + active tab (EXPENSE/INCOME) using SWR
  const swrKey = fundId ? ["statistics", fundId, activeTab, Range.MONTH] : null;
  const { data: statistic } = useSWR(
    swrKey,
    async () =>
      await getStatisticsByFundIdDetail(fundId!, {
        range: Range.MONTH,
        transactionType:
          activeTab === "expense"
            ? TransactionType.EXPENSE
            : TransactionType.INCOME,
      } as unknown as getListStatisticsDto),
    { revalidateOnFocus: false }
  );

  const chartData = useMemo(() => {
    const stats = statistic;
    if (!stats || !stats.categories || stats.categories.length === 0) return [];

    // Map API fields (categoryName, amount, categoryColor) to chart-friendly keys
    return stats.categories
      .map((c: getCategoriesStatisticDto) => ({
        name: c.categoryName,
        value: Number(c.amount || 0),
        color: c.categoryColor || "#CBD5E1",
      }))
      .sort((a, b) => b.value - a.value);
  }, [statistic]);

  const currentTotal = statistic
    ? statistic.totalAmount || 0
    : activeTab === "expense"
    ? totalExpense || 0
    : totalIncome || 0;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-8 relative">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out`}
          style={{ left: activeTab === "expense" ? "4px" : "calc(50%)" }}
        />
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 relative z-10 py-2 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === "expense" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <TrendingDown
            size={16}
            className={activeTab === "expense" ? "text-rose-500" : ""}
          />{" "}
          Chi tiêu
        </button>
        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 relative z-10 py-2 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === "income" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <TrendingUp
            size={16}
            className={activeTab === "income" ? "text-emerald-500" : ""}
          />{" "}
          Thu nhập
        </button>
      </div>

      {/* Total Card */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Tổng {activeTab === "expense" ? "Chi" : "Thu"} Tháng này
        </span>
        <h1
          className={`text-3xl font-black mt-2 tracking-tight ${
            activeTab === "expense" ? "text-gray-900" : "text-emerald-600"
          }`}
        >
          {formatVND(currentTotal).replace("₫", "")}
          <span className="text-lg text-gray-400 ml-1 font-bold">đ</span>
        </h1>
      </div>

      {/* Chart Area */}
      <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 mb-6 relative">
        {/* Toggle Chart Type */}
        <div className="absolute top-4 right-4 bg-gray-50 p-1 rounded-lg flex gap-1 z-10">
          <button
            onClick={() => setChartType("pie")}
            className={`p-1.5 rounded transition-all ${
              chartType === "pie"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-gray-400"
            }`}
          >
            <PieIcon size={14} />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`p-1.5 rounded transition-all ${
              chartType === "bar"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-gray-400"
            }`}
          >
            <BarChart3 size={14} />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChartComponent
                data={chartData}
                formatVND={(v) => formatVND(v)}
              />
            ) : (
              <BarChartComponent
                data={chartData}
                formatVND={(v) => formatVND(v)}
              />
            )}
          </ResponsiveContainer>

          {/* Center Icon for Pie */}
          {chartType === "pie" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`p-3 rounded-full ${
                  activeTab === "expense"
                    ? "bg-rose-50 text-rose-500"
                    : "bg-emerald-50 text-emerald-500"
                }`}
              >
                {activeTab === "expense" ? (
                  <TrendingDown size={24} />
                ) : (
                  <TrendingUp size={24} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details List */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
          Chi tiết danh mục
        </h3>
        <div className="space-y-3">
          {chartData.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {currentTotal > 0
                      ? ((item.value / currentTotal) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold text-sm ${
                    activeTab === "expense"
                      ? "text-gray-900"
                      : "text-emerald-600"
                  }`}
                >
                  {activeTab === "expense" ? "-" : "+"}
                  {formatVND(item.value).replace("₫", "")}
                </div>
                <div className="text-2xs text-gray-400 font-bold uppercase">
                  VND
                </div>
              </div>
            </div>
          ))}
          {chartData.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8 italic">
              Chưa có giao dịch nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticChartPart;
