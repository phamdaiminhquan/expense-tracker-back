import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

interface Props {
  data: any[];
  formatVND: (v: any) => string;
}

const BarChartComponent: React.FC<Props> = ({ data, formatVND }) => {
  return (
    <React.Fragment>
      <BarChart data={data} barSize={24}>
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
        <RechartsTooltip
          cursor={{ fill: "#f3f4f6", radius: 4 }}
          formatter={(value) => formatVND(Number(value))}
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 4, 4]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </React.Fragment>
  );
};

export default BarChartComponent;
