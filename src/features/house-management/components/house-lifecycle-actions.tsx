import { deactivateHouseAction } from "../actions/deactivate-house.action";
import { reactivateHouseAction } from "../actions/reactivate-house.action";
import {
  canDeactivateHouse,
  canReactivateHouse,
  type HouseRuleContext,
} from "../lib/house-rules";

export function HouseLifecycleActions({
  houseId,
  context,
}: {
  houseId: string;
  context: HouseRuleContext;
}) {
  const deactivateRules = canDeactivateHouse(context);
  const reactivateRules = canReactivateHouse(context);

  if (!context.isActive && !reactivateRules.allowed) {
    return null;
  }

  return (
    <div className="space-y-4">
      {context.isActive ? (
        <form action={deactivateHouseAction.bind(null, houseId)}>
          <button
            className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={!deactivateRules.allowed}
            title={deactivateRules.reason}
          >
            Deactivate house
          </button>
          {!deactivateRules.allowed ? (
            <p className="mt-2 text-xs text-red-700">
              {deactivateRules.reason}
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-600">
              Deactivating a house prevents new members from joining.
            </p>
          )}
        </form>
      ) : (
        <form action={reactivateHouseAction.bind(null, houseId)}>
          <button
            className="w-full rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100"
            type="submit"
          >
            Reactivate house
          </button>
          <p className="mt-2 text-xs text-slate-600">
            Reactivating allows new members to join this house again.
          </p>
        </form>
      )}
    </div>
  );
}
