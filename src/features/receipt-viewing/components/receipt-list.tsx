import Link from "next/link";
import { ReceiptStatus } from "@prisma/client";
import { EmptyState } from "../../../components/ui/empty-state";
import { ReceiptStatusBadge } from "./receipt-status-badge";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";

export interface ReceiptListItem {
  id: string;
  receiptNumber: string;
  status: ReceiptStatus;
  payment: {
    amount: number;
    paymentMethod: string;
    createdAt: Date;
    fund: {
      name: string;
    };
  };
}

export function ReceiptList({ receipts }: { receipts: ReceiptListItem[] }) {
  if (receipts.length === 0) {
    return (
      <EmptyState
        description="No receipts are available yet. Receipts are created when payments are accepted."
        title="No receipts"
      />
    );
  }

  return (
    <div className="space-y-3">
      {receipts.map((receipt) => (
        <Link
          className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
          href={`/village/receipts/${receipt.id}`}
          key={receipt.id}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {receipt.receiptNumber}
              </p>
              <p className="truncate text-xs text-slate-600">
                {receipt.payment.fund.name} · {receipt.payment.paymentMethod} ·{" "}
                {formatYangonDateTime(receipt.payment.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {formatAmount(receipt.payment.amount)}
              </p>
              <ReceiptStatusBadge status={receipt.status} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
