import { VillageStatus } from "@prisma/client";

import { deactivateVillageAction } from "../actions/deactivate-village.action";
import { reactivateVillageAction } from "../actions/reactivate-village.action";
import { suspendVillageAction } from "../actions/suspend-village.action";
import {
  canDeactivateVillage,
  canReactivateVillage,
  canSuspendVillage,
} from "../lib/village-lifecycle";

export function VillageLifecycleActions({
  status,
  villageId,
}: {
  status: VillageStatus;
  villageId: string;
}) {
  if (status === VillageStatus.DEACTIVATED) {
    return (
      <p className="text-sm text-slate-600">
        This village is deactivated. No lifecycle actions are available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {canSuspendVillage(status) ? (
        <form action={suspendVillageAction}>
          <input name="villageId" type="hidden" value={villageId} />

          <button
            className="w-full rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
            type="submit"
          >
            Suspend village
          </button>
        </form>
      ) : null}

      {canReactivateVillage(status) ? (
        <form action={reactivateVillageAction}>
          <input name="villageId" type="hidden" value={villageId} />

          <button
            className="w-full rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100"
            type="submit"
          >
            Reactivate village
          </button>
        </form>
      ) : null}

      {canDeactivateVillage(status) ? (
        <form action={deactivateVillageAction} className="space-y-2">
          <input name="villageId" type="hidden" value={villageId} />

          <button
            className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100"
            type="submit"
          >
            Deactivate village
          </button>

          <p className="text-xs text-red-700">
            Deactivation is final for MVP. The village record and historical
            data are preserved, but village users will lose access.
          </p>
        </form>
      ) : null}
    </div>
  );
}
