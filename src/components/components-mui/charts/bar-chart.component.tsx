import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface BarChartProps {
  data: any[];
  formatVND: (v: any) => string;
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  formatVND,
}) => {
  const normalized = (data || [])
    .map((e: any) => ({
      name: e.name ?? e.categoryName ?? "",
      value: Number(e.value ?? e.amount ?? 0),
      color: e.color ?? e.categoryColor ?? "#CBD5E1",
    }))
    .filter((item) => item.value > 0);

  if (normalized.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Chưa có dữ liệu
      </div>
    );
  }

  const minWidth = Math.max(280, normalized.length * 60);

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden">
      <div style={{ minWidth: `${minWidth}px`, height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={normalized}
            barSize={24}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "#f3f4f6", radius: 4 }}
              formatter={(value) => formatVND(Number(value))}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {normalized.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
