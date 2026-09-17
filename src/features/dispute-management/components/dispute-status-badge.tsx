import { DisputeStatus } from "@prisma/client";
import { formatDisputeStatus } from "../lib/dispute-rules";

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  const styles: Record<DisputeStatus, string> = {
    [DisputeStatus.OPEN]: "border-amber-200 bg-amber-50 text-amber-700",
    [DisputeStatus.UNDER_REVIEW]: "border-blue-200 bg-blue-50 text-blue-700",
    [DisputeStatus.RESOLVED]:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    [DisputeStatus.REJECTED]: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${styles[status]}`}
    >
      {formatDisputeStatus(status)}
    </span>
  );
}
