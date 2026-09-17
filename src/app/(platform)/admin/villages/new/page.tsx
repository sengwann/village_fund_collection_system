import Link from "next/link";

import { CreateVillageForm } from "../../../../../features/village-management/components/create-village-form";
import { requireSystemAdmin } from "../../../../../lib/authz";

export const metadata = {
  title: "Create Village | Village Fund Collection System",
};

export default async function NewVillagePage() {
  await requireSystemAdmin();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Create village
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Create a new village and its initial Chief account.
            </p>
          </div>

          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/admin/villages"
          >
            Back to villages
          </Link>
        </div>
      </div>

      <CreateVillageForm />
    </div>
  );
}
