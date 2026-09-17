import { formatAmount } from "@/lib/utils";

export function CurrentFundCard({
  fundName,
  totalAmount,
  amountPerHouse,
  numberOfHouse,
  collectedAmount,
}: {
  fundName: string;
  totalAmount: number;
  amountPerHouse: number | null;
  numberOfHouse: number | null;
  collectedAmount: number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-900">Current Fund</h2>
      <dl className="mt-3 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Fund name</dt>
          <dd className="text-slate-900">{fundName}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Total project amount</dt>
          <dd className="text-slate-900">{formatAmount(totalAmount)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Amount per house</dt>
          <dd className="text-slate-900">
            {amountPerHouse !== null ? formatAmount(amountPerHouse) : "—"}
            {amountPerHouse !== null && numberOfHouse !== null ? (
              <span className="ml-1 text-xs text-slate-500">
                (total ÷ {numberOfHouse} houses, rounded up)
              </span>
            ) : null}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Collected amount</dt>
          <dd className="text-slate-900">{formatAmount(collectedAmount)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-slate-600">
        Your payment must be at least the amount per house. Overpayment is
        allowed as an extra contribution. Collected amount includes only
        ACCEPTED payments.
      </p>
    </div>
  );
}
