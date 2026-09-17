import { DisputeStatus } from "@prisma/client";
import { DisputeStatusBadge } from "./dispute-status-badge";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface DisputeDetailData {
  id: string;
  status: DisputeStatus;
  description: string;
  resolutionNote: string | null;
  createdAt: Date;
  raisedBy: { name: string };
  payment: {
    amount: number;
    paymentMethod: string;
    kpayTransactionId: string | null;
    kpayReceiverAccount: string | null;
    rejectionNote: string | null;
    createdAt: Date;
    fund: { name: string };
    house: { houseNumber: string };
    payer: { name: string };
    collector: { name: string } | null;
  };
}

export function DisputeDetailCard({ dispute }: { dispute: DisputeDetailData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Dispute information
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Status</dt>
            <dd>
              <DisputeStatusBadge status={dispute.status} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Raised by</dt>
            <dd className="text-slate-900">{dispute.raisedBy.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Date</dt>
            <dd className="text-slate-900">
              {formatYangonDateTime(dispute.createdAt)}
            </dd>
          </div>
        </dl>
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium text-slate-900">
            Villager's Description
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
            {dispute.description}
          </p>
        </div>
        {dispute.resolutionNote && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium text-slate-900">
              Chief's Resolution Note
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {dispute.resolutionNote}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Original Payment & KPay Proof
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Amount</dt>
            <dd className="text-slate-900">
              {formatAmount(dispute.payment.amount)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Fund</dt>
            <dd className="text-slate-900">{dispute.payment.fund.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">House</dt>
            <dd className="text-slate-900">
              {dispute.payment.house.houseNumber}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Payer</dt>
            <dd className="text-slate-900">{dispute.payment.payer.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Date</dt>
            <dd className="text-slate-900">
              {formatYangonDateTime(dispute.payment.createdAt)}
            </dd>
          </div>

          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
              KPay Details (Auto-derived)
            </p>
            <div className="flex justify-between">
              <dt className="font-medium text-slate-700">Transaction ID</dt>
              <dd className="font-mono text-slate-900">
                {dispute.payment.kpayTransactionId ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between mt-1">
              <dt className="font-medium text-slate-700">Receiver Account</dt>
              <dd className="text-slate-900">
                {dispute.payment.kpayReceiverAccount ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between mt-1">
              <dt className="font-medium text-slate-700">
                Receiver Name (Collector)
              </dt>
              <dd className="text-slate-900">
                {dispute.payment.collector?.name ?? "Unknown"}
              </dd>
            </div>
          </div>
        </dl>
        {dispute.payment.rejectionNote && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium text-red-900">
              Original Rejection Reason
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
              {dispute.payment.rejectionNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
