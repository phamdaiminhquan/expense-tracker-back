import React from "react";
import { MoreHorizontal, ChevronRight } from "lucide-react";
import StatisticChartPart from "./parts/statistic-chart/statistic-chart.part";

interface ChartOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  messages: any[];
  totalExpense: number;
  totalIncome: number;
}
export const StatisticPage = ({
  isOpen,
  onClose,
  messages,
  totalExpense,
  totalIncome,
}: ChartOverlayProps) => {
  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-end pointer-events-none`}
    >
      {/* Main Panel - mobile slide */}
      <div
        className={`w-full md:max-w-md h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Dashboard */}
        <div className="pt-8 pb-4 px-6 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronRight size={26} />
          </button>
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
            Thống kê
          </h2>
          <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={24} />
          </button>
        </div>

        <StatisticChartPart
          messages={messages}
          totalExpense={totalExpense}
          totalIncome={totalIncome}
        />
      </div>
    </div>
  );
};
