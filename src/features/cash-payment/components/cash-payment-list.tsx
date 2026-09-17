import { PaymentStatus } from "@prisma/client";
import { EmptyState } from "../../../components/ui/empty-state";
import { VoidPaymentForm } from "./void-payment-form";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface CashPaymentListItem {
  id: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
  voidReason: string | null;
  house: {
    houseNumber: string;
  };
  payer: {
    name: string;
  };
}

export function CashPaymentList({
  payments,
}: {
  payments: CashPaymentListItem[];
}) {
  if (payments.length === 0) {
    return (
      <EmptyState
        description="No cash payments have been recorded yet."
        title="No cash payments"
      />
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          className="rounded-md border border-slate-200 p-3"
          key={payment.id}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {payment.payer.name}
              </p>
              <p className="truncate text-xs text-slate-600">
                House {payment.house.houseNumber} ·{" "}
                {formatYangonDateTime(payment.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {formatAmount(payment.amount)}
              </p>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                  payment.status === PaymentStatus.ACCEPTED
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {payment.status}
              </span>
            </div>
          </div>

          {payment.status === PaymentStatus.VOIDED && payment.voidReason ? (
            <p className="mt-2 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
              Void reason: {payment.voidReason}
            </p>
          ) : null}

          {payment.status === PaymentStatus.ACCEPTED ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-red-700 hover:text-red-900">
                Void this payment
              </summary>
              <div className="mt-2">
                <VoidPaymentForm paymentId={payment.id} />
              </div>
            </details>
          ) : null}
        </div>
      ))}
    </div>
  );
}
