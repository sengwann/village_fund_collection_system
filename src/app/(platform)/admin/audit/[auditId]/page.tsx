import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSystemAdmin } from "@/lib/authz";
import { AuditDetailCard } from "@/features/audit/components/audit-detail-card";
import { extractRouteParam } from "@/features/audit/lib/audit-filters";
import { getPlatformAuditDetail } from "@/features/audit/lib/audit-queries";
import type { EntityLinkInfo } from "@/features/audit/lib/audit-entity-labels";

export const metadata = {
  title: "Platform Audit Detail | Village Fund Collection System",
};

export default async function PlatformAuditDetailPage({
  params,
}: {
  params: unknown;
}) {
  await requireSystemAdmin();
  const auditId = await extractRouteParam(params, "auditId");
  if (!auditId) {
    notFound();
  }

  const audit = await getPlatformAuditDetail({ auditId });
  if (!audit) {
    notFound();
  }

  const entityInfo: EntityLinkInfo = {
    label:
      audit.villageCode && audit.villageName
        ? `${audit.villageCode} — ${audit.villageName}`
        : (audit.entityId ?? "—"),
    href: audit.villageId ? `/admin/villages/${audit.villageId}` : null,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Platform Audit Detail
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              A single immutable village lifecycle record.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/admin/audit"
          >
            Back to platform audit
          </Link>
        </div>
      </div>

      <AuditDetailCard
        actionType={audit.actionType}
        actorName={audit.actorName}
        createdAt={audit.createdAt}
        entityInfo={entityInfo}
        entityType={audit.entityType}
        metadata={audit.metadata}
      />
    </div>
  );
}
