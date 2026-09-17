import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { AuditActionBadge } from "./audit-action-badge";
import { AuditEntityBadge } from "./audit-entity-badge";
import type { AuditLogListItem } from "../lib/audit-queries";
import { formatYangonDateTime } from "@/lib/utils";

export function AuditLogList({
  logs,
  basePath,
}: {
  logs: AuditLogListItem[];
  basePath: string;
}) {
  if (logs.length === 0) {
    return (
      <EmptyState
        description="No audit records match the current filters."
        title="No audit logs"
      />
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Link
          className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
          href={`${basePath}/${log.id}`}
          key={log.id}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <AuditActionBadge actionType={log.actionType} />
              <AuditEntityBadge entityType={log.entityType} />
            </div>
            <span className="shrink-0 text-xs text-slate-500">
              {formatYangonDateTime(log.createdAt)}
            </span>
          </div>
          <p className="mt-2 truncate text-xs text-slate-600">
            By {log.actorName ?? "System"}
          </p>
        </Link>
      ))}
    </div>
  );
}
