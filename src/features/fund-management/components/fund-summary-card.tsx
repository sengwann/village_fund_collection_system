import { formatAmount } from "@/lib/utils";

export function FundSummaryCard({
  targetAmount,
  collectedAmount,
  acceptedCount,
}: {
  targetAmount: number;
  collectedAmount: number;
  acceptedCount: number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-900">Collection summary</h2>

      <dl className="mt-3 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Target amount</dt>
          <dd className="text-slate-900">{formatAmount(targetAmount)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Collected amount</dt>
          <dd className="text-slate-900">{formatAmount(collectedAmount)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Accepted payments</dt>
          <dd className="text-slate-900">{acceptedCount}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-slate-600">
        Collected amount includes only ACCEPTED payments.
      </p>
    </div>
  );
}
