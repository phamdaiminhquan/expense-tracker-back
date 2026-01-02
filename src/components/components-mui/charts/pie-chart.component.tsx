import React from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { StackRowAlignJustCenter } from "../styles/stack.style";

interface Props {
  data: any[];
  formatVND: (v: any) => string;
}

export const PieChartComponent: React.FC<Props> = ({ data, formatVND }) => {
  const normalized = (data || []).map((e: any) => ({
    name: e.name ?? e.categoryName ?? "",
    value: Number(e.value ?? e.amount ?? 0),
    color: e.color ?? e.categoryColor ?? "#CBD5E1",
  }));

  return (
    <StackRowAlignJustCenter>
      <PieChart width={280} height={256}>
        <Pie
          data={normalized}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
          cornerRadius={5}
        >
          {normalized.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <RechartsTooltip
          formatter={(value) => formatVND(Number(value))}
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
      </PieChart>
    </StackRowAlignJustCenter>
  );
};
