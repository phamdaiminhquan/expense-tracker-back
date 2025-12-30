import React, { useMemo, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import { ResponsiveContainer } from "recharts";
import PieChartComponent from "../../../../components/components/charts/pie-chart.component";
import BarChartComponent from "../../../../components/components/charts/bar-chart.component";

interface Props {
  messages: any[];
  totalExpense: number;
  totalIncome: number;
}

const StatisticChartPart: React.FC<Props> = ({
  messages,
  totalExpense,
  totalIncome,
}) => {
  const [activeTab, setActiveTab] = useState("expense");
  const [chartType, setChartType] = useState("pie");

  const chartData = useMemo(() => {
    const relevantType = activeTab;
    const relevantMsgs = messages.filter(
      (m) =>
        m.status === "done" && m.transType === relevantType && m.rawAmount > 0
    );

    const grouped = relevantMsgs.reduce((acc, curr) => {
      const cat = curr.category || "Khác";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0, color: "" };
      acc[cat].value += curr.rawAmount;
      return acc;
    }, {} as Record<string, any>);

    let result = Object.values(grouped);
    if (result.length === 0) {
      if (relevantType === "expense") {
        return [
          { name: "Ăn uống", value: 0, color: "#F43F5E" },
          { name: "Mua sắm", value: 0, color: "#3B82F6" },
        ];
      } else {
        return [
          { name: "Lương", value: 0, color: "#10B981" },
          { name: "Thưởng", value: 0, color: "#F59E0B" },
        ];
      }
    }

    const EXPENSE_COLORS = [
      "#F43F5E",
      "#FB923C",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
    ];
    const INCOME_COLORS = ["#10B981", "#34D399", "#06B6D4", "#F59E0B"];
    const palette = relevantType === "expense" ? EXPENSE_COLORS : INCOME_COLORS;

    return result
      .map((item: any, idx: number) => ({
        ...item,
        color: palette[idx % palette.length],
      }))
      .sort((a: any, b: any) => b.value - a.value);
  }, [messages, activeTab]);

  const currentTotal = activeTab === "expense" ? totalExpense : totalIncome;

  const formatVND = (val: any) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(val));

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar bg-gray-50/50">
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
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-6 relative">
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
                <div className="text-[10px] text-gray-400 font-bold uppercase">
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
