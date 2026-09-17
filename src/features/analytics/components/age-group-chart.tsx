"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartEmptyState } from "./chart-empty-state";

interface AgeGroupData {
  group: string;
  count: number;
}

const COLORS: Record<string, string> = {
  Children: "#60a5fa", // blue-400
  Teenagers: "#a78bfa", // violet-400
  Adults: "#34d399", // emerald-400
  Elderly: "#fbbf24", // amber-400
  "Not set": "#94a3b8", // slate-400
};

export function AgeGroupChart({ data }: { data: AgeGroupData[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return <ChartEmptyState message="No member data available." />;
  }

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="group"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value} members`, "Count"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.group} fill={COLORS[entry.group] ?? "#94a3b8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-xs text-slate-500">
        Total active members: {total}
      </p>
    </div>
  );
}
