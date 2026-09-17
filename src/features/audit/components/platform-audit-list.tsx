import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { AuditActionBadge } from "./audit-action-badge";
import type { PlatformAuditLogListItem } from "../lib/audit-queries";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function PlatformAuditList({
  logs,
}: {
  logs: PlatformAuditLogListItem[];
}) {
  if (logs.length === 0) {
    return (
      <EmptyState
        description="No village lifecycle events match the current filters."
        title="No platform audit logs"
      />
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Link
          className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
          href={`/admin/audit/${log.id}`}
          key={log.id}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {log.villageCode ?? "Village"}
              </p>
              <p className="truncate text-xs text-slate-600">
                {log.villageName ?? "—"}
              </p>
            </div>
            <AuditActionBadge actionType={log.actionType} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="truncate text-xs text-slate-600">
              By {log.actorName ?? "System"}
            </p>
            <span className="shrink-0 text-xs text-slate-500">
              {formatDateTime(log.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
