import Link from "next/link";
import { DisputeStatus, PaymentStatus } from "@prisma/client";
import { EmptyState } from "../../../components/ui/empty-state";
import { PaymentStatusBadge } from "./payment-status-badge";
import { formatAmount, formatYangonDateTime } from "@/lib/utils";

function formatDisputeStatus(status: DisputeStatus): string {
  return status.replace(/_/g, " ");
}

const disputeStatusStyles: Record<DisputeStatus, string> = {
  [DisputeStatus.OPEN]: "border-amber-200 bg-amber-50 text-amber-700",
  [DisputeStatus.UNDER_REVIEW]: "border-blue-200 bg-blue-50 text-blue-700",
  [DisputeStatus.RESOLVED]: "border-emerald-200 bg-emerald-50 text-emerald-700",
  [DisputeStatus.REJECTED]: "border-red-200 bg-red-50 text-red-700",
};

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  rejectionNote: string | null;
  createdAt: Date;
  activeDispute: {
    id: string;
    status: DisputeStatus;
  } | null;
}

export function PaymentHistoryList({
  payments,
}: {
  payments: PaymentHistoryItem[];
}) {
  if (payments.length === 0) {
    return (
      <EmptyState
        description="You have not submitted any payments yet."
        title="No payment history"
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
                {formatAmount(payment.amount)}
              </p>
              <p className="truncate text-xs text-slate-600">
                {payment.paymentMethod} ·{" "}
                {formatYangonDateTime(payment.createdAt)}
              </p>
            </div>
            <PaymentStatusBadge status={payment.status} />
          </div>

          {payment.status === PaymentStatus.REJECTED &&
          payment.rejectionNote ? (
            <p className="mt-2 rounded-md border border-red-100 bg-red-50 p-2 text-xs text-red-700">
              Rejection reason: {payment.rejectionNote}
            </p>
          ) : null}

          {payment.status === PaymentStatus.REJECTED &&
          payment.paymentMethod === "KPAY" ? (
            payment.activeDispute ? (
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${disputeStatusStyles[payment.activeDispute.status]}`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 9v4m0 4h.01M12 3l9.66 16.5H2.34L12 3z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  Dispute {formatDisputeStatus(payment.activeDispute.status)}
                </span>
                <span className="text-xs text-slate-500">
                  Cannot raise another dispute
                </span>
              </div>
            ) : (
              <Link
                className="mt-2 inline-block rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
                href={`/village/disputes/new?paymentId=${payment.id}`}
              >
                Dispute this payment
              </Link>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
}
