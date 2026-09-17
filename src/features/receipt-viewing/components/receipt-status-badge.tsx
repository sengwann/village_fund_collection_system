import { ReceiptStatus } from "@prisma/client";

export function ReceiptStatusBadge({ status }: { status: ReceiptStatus }) {
  if (status === ReceiptStatus.ACTIVE) {
    return (
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        ACTIVE
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
      VOIDED
    </span>
  );
}
