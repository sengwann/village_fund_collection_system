import Link from "next/link";
import { notFound } from "next/navigation";

import { VillageLifecycleActions } from "../../../../../features/village-management/components/village-lifecycle-actions";
import { VillageStatusBadge } from "../../../../../features/village-management/components/village-status-badge";
import { requireVillageLifecycleAccess } from "../../../../../lib/authz";

export const metadata = {
  title: "Village Detail | Village Fund Collection System",
};

type RouteParams = Record<string, string | string[] | undefined>;

async function extractVillageId(rawParams: unknown): Promise<string> {
  if (!rawParams) {
    return "";
  }

  let params: RouteParams;

  const maybePromise = rawParams as {
    then?: unknown;
  };

  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }

  const villageId = params.villageId;

  if (Array.isArray(villageId)) {
    return villageId[0] ?? "";
  }

  return villageId ?? "";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export default async function VillageDetailPage({
  params,
}: {
  params: unknown;
}) {
  const villageId = await extractVillageId(params);

  if (!villageId) {
    notFound();
  }

  const village = await requireVillageLifecycleAccess(villageId);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900">
              {village.villageCode}
            </h1>

            <p className="truncate text-sm text-slate-600">{village.name}</p>
          </div>

          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/admin/villages"
          >
            Back to villages
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            Village lifecycle
          </h2>

          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Status</dt>
              <dd>
                <VillageStatusBadge status={village.status} />
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Created</dt>
              <dd className="text-slate-900">
                {formatDate(village.createdAt)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Updated</dt>
              <dd className="text-slate-900">
                {formatDate(village.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            Lifecycle actions
          </h2>

          <div className="mt-3">
            <VillageLifecycleActions
              status={village.status}
              villageId={village.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
