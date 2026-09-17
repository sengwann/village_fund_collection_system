import { requireSystemAdmin } from "@/lib/authz";
import { AuditFiltersForm } from "@/features/audit/components/audit-filters-form";
import { AuditPagination } from "@/features/audit/components/audit-pagination";
import { PlatformAuditList } from "@/features/audit/components/platform-audit-list";
import {
  ACTION_TYPE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  getFirstString,
  parseAuditFilters,
  resolveSearchParams,
} from "@/features/audit/lib/audit-filters";
import { getPlatformAuditLogs } from "@/features/audit/lib/audit-queries";

export const metadata = {
  title: "Platform Audit | Village Fund Collection System",
};

export default async function PlatformAuditPage({
  searchParams,
}: {
  searchParams?: unknown;
}) {
  await requireSystemAdmin();
  const params = await resolveSearchParams(searchParams);
  const filters = parseAuditFilters(params);
  const { logs, totalPages } = await getPlatformAuditLogs({ filters });

  const rawActionType = getFirstString(params.actionType);
  const rawDateFrom = getFirstString(params.dateFrom);
  const rawDateTo = getFirstString(params.dateTo);

  const filterParams = new URLSearchParams();
  if (filters.actionType) {
    filterParams.set("actionType", filters.actionType);
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
        <h1 className="text-lg font-semibold text-slate-900">Platform Audit</h1>
        <p className="mt-1 text-sm text-slate-600">
          Village lifecycle events across the platform. Only village-level
          lifecycle logs are shown here.
        </p>
      </div>

      <AuditFiltersForm
        actionTypeOptions={ACTION_TYPE_OPTIONS}
        basePath="/admin/audit"
        entityTypeOptions={ENTITY_TYPE_OPTIONS}
        initialActionType={rawActionType}
        initialDateFrom={rawDateFrom}
        initialDateTo={rawDateTo}
        initialEntityType=""
        showEntityTypeFilter={false}
      />

      <PlatformAuditList logs={logs} />

      <AuditPagination
        basePath="/admin/audit"
        baseQuery={baseQuery}
        currentPage={filters.page}
        totalPages={totalPages}
      />
    </div>
  );
}
