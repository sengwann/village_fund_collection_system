import Link from "next/link";
import { notFound } from "next/navigation";
import { requireChief } from "@/lib/authz";
import { AuditDetailCard } from "@/features/audit/components/audit-detail-card";
import { resolveEntityInfo } from "@/features/audit/lib/audit-entity-labels";
import { extractRouteParam } from "@/features/audit/lib/audit-filters";
import { getChiefAuditDetail } from "@/features/audit/lib/audit-queries";

export const metadata = {
  title: "Audit Detail | Village Fund Collection System",
};

export default async function VillageAuditDetailPage({
  params,
}: {
  params: unknown;
}) {
  const { villageId } = await requireChief();
  const auditId = await extractRouteParam(params, "auditId");
  if (!auditId) {
    notFound();
  }

  const audit = await getChiefAuditDetail({ auditId, villageId });
  if (!audit) {
    notFound();
  }

  const entityInfo = await resolveEntityInfo(
    audit.entityType,
    audit.entityId,
    villageId,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Audit Detail
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              A single immutable audit record.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/village/audit"
          >
            Back to audit log
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
