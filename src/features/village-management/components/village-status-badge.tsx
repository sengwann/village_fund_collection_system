import { VillageStatus } from "@prisma/client";

export function VillageStatusBadge({ status }: { status: VillageStatus }) {
  const stylesByStatus: Record<VillageStatus, string> = {
    [VillageStatus.ACTIVE]: "border-emerald-200 bg-emerald-50 text-emerald-700",
    [VillageStatus.SUSPENDED]: "border-amber-200 bg-amber-50 text-amber-700",
    [VillageStatus.DEACTIVATED]: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${stylesByStatus[status]}`}
    >
      {status}
    </span>
  );
}
