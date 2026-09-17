import { PaymentMethod, ReceiptStatus } from "@prisma/client";
import { ReceiptStatusBadge } from "./receipt-status-badge";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface ReceiptDetailData {
  id: string;
  receiptNumber: string;
  status: ReceiptStatus;
  createdAt: Date;
  payment: {
    id: string;
    amount: number;
    paymentMethod: PaymentMethod;
    kpayTransactionId: string | null;
    kpayReceiverAccount: string | null;
    voidReason: string | null;
    createdAt: Date;
    fund: { name: string };
    house: { houseNumber: string };
    payer: { name: string };
    collector: { name: string } | null;
  };
}

export function ReceiptDetailCard({ receipt }: { receipt: ReceiptDetailData }) {
  const isKpay = receipt.payment.paymentMethod === PaymentMethod.KPAY;
  const isVoided = receipt.status === ReceiptStatus.VOIDED;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Receipt information
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Receipt number</dt>
            <dd className="font-mono text-slate-900">
              {receipt.receiptNumber}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Status</dt>
            <dd>
              <ReceiptStatusBadge status={receipt.status} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Payment date</dt>
            <dd className="text-slate-900">
              {formatYangonDateTime(receipt.payment.createdAt)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Amount</dt>
            <dd className="text-slate-900">
              {formatAmount(receipt.payment.amount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Payment method</dt>
            <dd className="text-slate-900">{receipt.payment.paymentMethod}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Fund</dt>
            <dd className="text-slate-900">{receipt.payment.fund.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">House</dt>
            <dd className="text-slate-900">
              {receipt.payment.house.houseNumber}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Payer</dt>
            <dd className="text-slate-900">{receipt.payment.payer.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Collector</dt>
            <dd className="text-slate-900">
              {receipt.payment.collector?.name ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      {isKpay ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            KPay transaction
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">
                Transaction last 10 digits
              </dt>
              <dd className="font-mono text-slate-900">
                {receipt.payment.kpayTransactionId ?? "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">
                Receiver KPay account
              </dt>
              <dd className="font-mono text-slate-900">
                {receipt.payment.kpayReceiverAccount ?? "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            Sender KPay details are kept private. Only the transaction&apos;s
            last 10 digits and the receiver account are shown.
          </p>
        </div>
      ) : null}

      {isVoided && receipt.payment.voidReason ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-700">Void reason</h2>
          <p className="mt-2 text-sm text-slate-600">
            {receipt.payment.voidReason}
          </p>
        </div>
      ) : null}
    </div>
  );
}
