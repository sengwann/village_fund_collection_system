import { AuditEntityType } from "@/lib/audit/audit.types";

const stylesByEntity: Record<string, string> = {
  [AuditEntityType.VILLAGE]: "border-purple-200 bg-purple-50 text-purple-700",
  [AuditEntityType.HOUSE]: "border-blue-200 bg-blue-50 text-blue-700",
  [AuditEntityType.USER]: "border-slate-200 bg-slate-100 text-slate-700",
  [AuditEntityType.FUND]: "border-emerald-200 bg-emerald-50 text-emerald-700",
  [AuditEntityType.COLLECTOR_ASSIGNMENT]:
    "border-cyan-200 bg-cyan-50 text-cyan-700",
  [AuditEntityType.PAYMENT]: "border-amber-200 bg-amber-50 text-amber-700",
  [AuditEntityType.RECEIPT]: "border-teal-200 bg-teal-50 text-teal-700",
  [AuditEntityType.DISPUTE]: "border-red-200 bg-red-50 text-red-700",
  [AuditEntityType.SESSION]: "border-slate-200 bg-slate-100 text-slate-600",
};

export function AuditEntityBadge({ entityType }: { entityType: string }) {
  const label = entityType.replace(/_/g, " ");
  const styles =
    stylesByEntity[entityType] ??
    "border-slate-200 bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
