import Link from "next/link";
import { AuditActionType } from "@prisma/client";
import { AuditActionBadge } from "./audit-action-badge";
import { AuditEntityBadge } from "./audit-entity-badge";
import { AuditMetadataViewer } from "./audit-metadata-viewer";
import type { EntityLinkInfo } from "../lib/audit-entity-labels";
import { formatYangonDateTime } from "@/lib/utils";

export function AuditDetailCard({
  actionType,
  entityType,
  actorName,
  createdAt,
  entityInfo,
  metadata,
}: {
  actionType: AuditActionType;
  entityType: string;
  actorName: string | null;
  createdAt: Date;
  entityInfo: EntityLinkInfo;
  metadata: unknown;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Event information
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Action</dt>
            <dd>
              <AuditActionBadge actionType={actionType} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Entity type</dt>
            <dd>
              <AuditEntityBadge entityType={entityType} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Entity</dt>
            <dd className="text-slate-900">
              {entityInfo.href ? (
                <Link
                  className="underline underline-offset-2 transition hover:text-slate-700"
                  href={entityInfo.href}
                >
                  {entityInfo.label}
                </Link>
              ) : (
                entityInfo.label
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Actor</dt>
            <dd className="text-slate-900">{actorName ?? "System"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Timestamp</dt>
            <dd className="text-slate-900">
              {formatYangonDateTime(createdAt)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
          Audit records are append-only and cannot be edited or deleted.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Details</h2>
        <div className="mt-3">
          <AuditMetadataViewer metadata={metadata} />
        </div>
      </div>
    </div>
  );
}
