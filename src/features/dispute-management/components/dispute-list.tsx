import Link from "next/link";
import { DisputeStatus } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";
import { DisputeStatusBadge } from "./dispute-status-badge";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface DisputeListItem {
  id: string;
  status: DisputeStatus;
  description: string;
  createdAt: Date;
  raisedBy: { name: string };
  payment: {
    amount: number;
    fund: { name: string };
    house: { houseNumber: string };
  };
}

export function DisputeList({
  disputes,
  showRaiser,
}: {
  disputes: DisputeListItem[];
  showRaiser: boolean;
}) {
  if (disputes.length === 0)
    return (
      <EmptyState
        title="No disputes"
        description="No disputes found for this filter."
      />
    );

  return (
    <div className="space-y-3">
      {disputes.map((d) => (
        <Link
          href={`/village/disputes/${d.id}`}
          key={d.id}
          className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {formatAmount(d.payment.amount)} · {d.payment.fund.name}
              </p>
              <p className="truncate text-xs text-slate-600">
                House {d.payment.house.houseNumber} ·{" "}
                {formatYangonDateTime(d.createdAt)}
                {showRaiser && ` · Raised by ${d.raisedBy.name}`}
              </p>
            </div>
            <DisputeStatusBadge status={d.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-slate-600">
            {d.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
