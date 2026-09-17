"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartEmptyState } from "./chart-empty-state";

interface MonthlyData {
  label: string;
  amount: number;
  count: number;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en").format(amount);
}

export function CollectionTrendChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return <ChartEmptyState message="No collection data yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="collectionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
          tickFormatter={(value: number) => formatAmount(value)}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatAmount(value),
            name === "amount" ? "Collected" : name,
          ]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#collectionGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
