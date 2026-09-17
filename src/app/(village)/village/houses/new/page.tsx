import Link from "next/link";
import { requireChief } from "@/lib/authz";
import { CreateHouseForm } from "@/features/house-management/components/create-house-form";

export const metadata = {
  title: "Create House | Village Fund Collection System",
};

export default async function NewHousePage() {
  await requireChief();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Create house
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Add a new official house number to your village.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/village/houses"
          >
            Back to houses
          </Link>
        </div>
      </div>
      <CreateHouseForm />
    </div>
  );
}
