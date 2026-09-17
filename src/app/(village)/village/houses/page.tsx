import Link from "next/link";
import { requireChief } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui/empty-state";
import { HousesSearchForm } from "@/features/house-management/components/houses-search-form";

export const metadata = {
  title: "Houses | Village Fund Collection System",
};

export default async function HousesPage() {
  const { villageId } = await requireChief();

  const houses = await prisma.house.findMany({
    where: {
      villageId,
    },
    orderBy: {
      houseNumber: "asc",
    },
    select: {
      id: true,
      houseNumber: true,
      isActive: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Houses</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage official house numbers in your village.
            </p>
          </div>

          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-700"
            href="/village/houses/new"
          >
            Create house
          </Link>
        </div>
      </div>

      <HousesSearchForm houses={houses} />

      {houses.length === 0 ? (
        <EmptyState
          title="No houses found"
          description="No houses have been created yet."
          action={
            <Link
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              href="/village/houses/new"
            >
              Create first house
            </Link>
          }
        />
      ) : null}
    </div>
  );
}
