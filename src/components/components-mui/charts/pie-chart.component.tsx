import React from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

interface Props {
  data: any[];
  formatVND: (v: any) => string;
}

const PieChartComponent: React.FC<Props> = ({ data, formatVND }) => {
  return (
    <React.Fragment>
      <PieChart>
        <Pie
          data={data}
          innerRadius={65}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
          cornerRadius={5}
        >
          {data.map((entry, index) => (
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
    </React.Fragment>
  );
};

export default PieChartComponent;
