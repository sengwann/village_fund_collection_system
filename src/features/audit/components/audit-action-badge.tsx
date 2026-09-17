import { AuditActionType } from "@prisma/client";

const stylesByAction: Record<AuditActionType, string> = {
  [AuditActionType.CREATE]: "border-emerald-200 bg-emerald-50 text-emerald-700",
  [AuditActionType.UPDATE]: "border-blue-200 bg-blue-50 text-blue-700",
  [AuditActionType.DELETE]: "border-red-200 bg-red-50 text-red-700",
  [AuditActionType.STATUS_CHANGE]:
    "border-amber-200 bg-amber-50 text-amber-700",
  [AuditActionType.APPROVE]:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  [AuditActionType.REJECT]: "border-red-200 bg-red-50 text-red-700",
  [AuditActionType.REMOVE]: "border-red-200 bg-red-50 text-red-700",
  [AuditActionType.ASSIGN]: "border-blue-200 bg-blue-50 text-blue-700",
  [AuditActionType.VOID]: "border-slate-200 bg-slate-100 text-slate-600",
  [AuditActionType.ACCEPT]: "border-emerald-200 bg-emerald-50 text-emerald-700",
  [AuditActionType.LOGIN]: "border-slate-200 bg-slate-100 text-slate-600",
  [AuditActionType.LOGOUT]: "border-slate-200 bg-slate-100 text-slate-600",
};

export function AuditActionBadge({
  actionType,
}: {
  actionType: AuditActionType;
}) {
  const label = actionType.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${stylesByAction[actionType]}`}
    >
      {label}
    </span>
  );
}
