import { requireChief } from "@/lib/authz";
import { AuditFiltersForm } from "@/features/audit/components/audit-filters-form";
import { AuditLogList } from "@/features/audit/components/audit-log-list";
import { AuditPagination } from "@/features/audit/components/audit-pagination";
import {
  ACTION_TYPE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  getFirstString,
  parseAuditFilters,
  resolveSearchParams,
  entityTypesByAction,
} from "@/features/audit/lib/audit-filters";
import { getChiefAuditLogs } from "@/features/audit/lib/audit-queries";

export const metadata = {
  title: "Audit Log | Village Fund Collection System",
};

export default async function VillageAuditPage({
  searchParams,
}: {
  searchParams?: unknown;
}) {
  const { villageId } = await requireChief();
  const params = await resolveSearchParams(searchParams);
  const filters = parseAuditFilters(params);
  const { logs, totalPages } = await getChiefAuditLogs({ villageId, filters });

  const rawActionType = getFirstString(params.actionType);
  const rawEntityType = getFirstString(params.entityType);
  const rawDateFrom = getFirstString(params.dateFrom);
  const rawDateTo = getFirstString(params.dateTo);

  const filterParams = new URLSearchParams();
  if (filters.actionType) {
    filterParams.set("actionType", filters.actionType);
  }
  if (filters.entityType) {
    filterParams.set("entityType", filters.entityType);
  }
  if (rawDateFrom) {
    filterParams.set("dateFrom", rawDateFrom);
  }
  if (rawDateTo) {
    filterParams.set("dateTo", rawDateTo);
  }
  const baseQuery = filterParams.toString();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Audit Log</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review the history of actions taken in your village. Audit records are
          append-only.
        </p>
      </div>

      <AuditFiltersForm
        entityTypesByAction={entityTypesByAction}
        actionTypeOptions={ACTION_TYPE_OPTIONS}
        basePath="/village/audit"
        entityTypeOptions={ENTITY_TYPE_OPTIONS}
        initialActionType={rawActionType}
        initialDateFrom={rawDateFrom}
        initialDateTo={rawDateTo}
        initialEntityType={rawEntityType}
        showEntityTypeFilter={true}
      />

      <AuditLogList basePath="/village/audit" logs={logs} />

      <AuditPagination
        basePath="/village/audit"
        baseQuery={baseQuery}
        currentPage={filters.page}
        totalPages={totalPages}
      />
    </div>
  );
}
