"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartEmptyState } from "./chart-empty-state";

interface PaidVsPendingData {
  label: string;
  count: number;
  amount: number;
}

const COLORS = ["#10b981", "#f59e0b"]; // emerald for Paid, amber for Pending

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en").format(amount);
}

export function PaidVsPendingChart({ data }: { data: PaidVsPendingData[] }) {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  if (totalCount === 0) {
    return <ChartEmptyState message="No payment data yet." />;
  }

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} payments`,
              name,
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-slate-600">
              {item.label}: {item.count} ({formatAmount(item.amount)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
