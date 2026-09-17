import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { requireSystemAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { VillagesSearch } from "@/features/village-management/components/villages-search";

export const metadata = {
  title: "Villages | Village Fund Collection System",
};

export default async function AdminVillagesPage() {
  await requireSystemAdmin();

  const villages = await prisma.village.findMany({
    select: {
      id: true,
      villageCode: true,
      name: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Villages</h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage village lifecycle.
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

      {villages.length === 0 ? (
        <EmptyState
          description="No villages have been created yet."
          title="No villages found"
        />
      ) : (
        <VillagesSearch villages={villages} />
      )}
    </div>
  );
}
