import { PaymentStatus } from "@prisma/client";
import { acceptKpayPaymentAction } from "../actions/accept-kpay-payment.action";
import { RejectPaymentForm } from "./reject-payment-form";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface PaymentVerificationData {
  id: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  kpayTransactionId: string | null;
  kpaySenderName: string | null;
  kpaySenderAccount: string | null;
  kpayReceiverAccount: string | null;
  rejectionNote: string | null;
  createdAt: Date;
  fund: {
    name: string;
    targetAmount: number;
  };
  house: {
    houseNumber: string;
  };
  payer: {
    name: string;
  };
}

export function PaymentVerificationDetail({
  payment,
}: {
  payment: PaymentVerificationData;
}) {
  const isPending = payment.status === PaymentStatus.PENDING;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Payment information
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Amount</dt>
            <dd className="text-slate-900">{formatAmount(payment.amount)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Fund</dt>
            <dd className="text-slate-900">{payment.fund.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Fund target</dt>
            <dd className="text-slate-900">
              {formatAmount(payment.fund.targetAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">House</dt>
            <dd className="text-slate-900">{payment.house.houseNumber}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Payer</dt>
            <dd className="text-slate-900">{payment.payer.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Method</dt>
            <dd className="text-slate-900">{payment.paymentMethod}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Date</dt>
            <dd className="text-slate-900">
              {formatYangonDateTime(payment.createdAt)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Status</dt>
            <dd>
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                {payment.status}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          KPay transaction details
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Transaction ID</dt>
            <dd className="font-mono text-slate-900">
              {payment.kpayTransactionId ?? "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">
              Sender&apos;s KPay name
            </dt>
            <dd className="text-slate-900">{payment.kpaySenderName ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">
              Sender&apos;s KPay account
            </dt>
            <dd className="text-slate-900">
              {payment.kpaySenderAccount ?? "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">
              Receiver&apos;s KPay account
            </dt>
            <dd className="text-slate-900">
              {payment.kpayReceiverAccount ?? "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-slate-600">
          Verify these details against the KPay app before accepting or
          rejecting.
        </p>
      </div>

      {isPending ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <h2 className="text-sm font-medium text-emerald-900">
              Accept payment
            </h2>
            <p className="mt-2 text-xs text-emerald-800">
              Accepting will create a receipt and mark the payment as accepted.
              This action cannot be undone.
            </p>
            <form action={acceptKpayPaymentAction} className="mt-3">
              <input name="paymentId" type="hidden" value={payment.id} />
              <button
                className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                type="submit"
              >
                Accept Payment
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-red-900">Reject payment</h2>
            <p className="mb-3 mt-2 text-xs text-slate-600">
              Rejecting requires a reason. The villager will see the rejection
              note and can resubmit.
            </p>
            <RejectPaymentForm paymentId={payment.id} />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <p className="text-sm text-slate-600">
            This payment has already been processed (
            <span className="font-medium">{payment.status}</span>). No further
            actions are available.
          </p>
          {payment.status === PaymentStatus.REJECTED &&
          payment.rejectionNote ? (
            <p className="mt-2 text-sm text-slate-700">
              Rejection reason: {payment.rejectionNote}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
