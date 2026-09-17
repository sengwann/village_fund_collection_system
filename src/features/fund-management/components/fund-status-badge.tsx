import { FundStatus } from "@prisma/client";

export function FundStatusBadge({ status }: { status: FundStatus }) {
  const stylesByStatus: Record<FundStatus, string> = {
    [FundStatus.DRAFT]: "border-amber-200 bg-amber-50 text-amber-700",
    [FundStatus.ACTIVE]: "border-emerald-200 bg-emerald-50 text-emerald-700",
    [FundStatus.CLOSED]: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${stylesByStatus[status]}`}
    >
      {status}
    </span>
  );
}
