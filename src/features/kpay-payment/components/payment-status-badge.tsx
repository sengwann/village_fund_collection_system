import { PaymentStatus } from "@prisma/client";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const stylesByStatus: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "border-amber-200 bg-amber-50 text-amber-700",
    [PaymentStatus.ACCEPTED]:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    [PaymentStatus.REJECTED]: "border-red-200 bg-red-50 text-red-700",
    [PaymentStatus.VOIDED]: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${stylesByStatus[status]}`}
    >
      {status}
    </span>
  );
}
