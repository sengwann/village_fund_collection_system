import Link from "next/link";
import { VillageStatus } from "@prisma/client";
import { EmptyState } from "../../../../components/ui/empty-state";
import { VillageStatusBadge } from "../../../../features/village-management/components/village-status-badge";
import { getPlatformShellContext } from "../../../../features/shell/lib/shell-context";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Platform Dashboard | Village Fund Collection System",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default async function AdminDashboardPage() {
  await getPlatformShellContext();

  const [
    totalVillages,
    activeVillages,
    suspendedVillages,
    deactivatedVillages,
    recentVillages,
  ] = await Promise.all([
    prisma.village.count(),
    prisma.village.count({ where: { status: VillageStatus.ACTIVE } }),
    prisma.village.count({ where: { status: VillageStatus.SUSPENDED } }),
    prisma.village.count({ where: { status: VillageStatus.DEACTIVATED } }),
    prisma.village.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        villageCode: true,
        name: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Villages",
      value: totalVillages,
      valueClass: "text-slate-900",
    },
    { label: "Active", value: activeVillages, valueClass: "text-emerald-600" },
    {
      label: "Suspended",
      value: suspendedVillages,
      valueClass: "text-amber-600",
    },
    {
      label: "Deactivated",
      value: deactivatedVillages,
      valueClass: "text-slate-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Platform dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Overview of all villages in the system.
            </p>
          </div>
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-700"
            href="/admin/villages/new"
          >
            Create village
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            key={stat.label}
          >
            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${stat.valueClass}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-slate-900">
            Recent villages
          </h2>
          <Link
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
            href="/admin/villages"
          >
            View all
          </Link>
        </div>
        {recentVillages.length === 0 ? (
          <EmptyState
            className="mt-3"
            description="No villages created yet. Create your first village to get started."
            title="No villages"
          />
        ) : (
          <div className="mt-3 space-y-3">
            {recentVillages.map((village) => (
              <Link
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 transition hover:bg-slate-50"
                href={`/admin/villages/${village.id}`}
                key={village.id}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {village.villageCode}
                  </p>
                  <p className="truncate text-xs text-slate-600">
                    {village.name}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <VillageStatusBadge status={village.status} />
                  <span className="hidden text-xs text-slate-500 sm:block">
                    {formatDate(village.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
